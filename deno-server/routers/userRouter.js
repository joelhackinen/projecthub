import { Router, scrypt, create, getNumericDate } from "../deps.js";
import { sql } from "../database.js";
import { key } from "../app.js";

const router = new Router();

const setJWT = async (user, cookies) => {
  const jwt = await create(
    { alg: "HS512", typ: "JWT" },
    { email: user.email, exp: getNumericDate(60 * 60 * 24) },
    key
  );

  cookies.set("token", jwt, { httpOnly: true })
};


router.put("/users", async ({ request, response, state, cookies }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const data = await body.value;
  const { repos, ...user } = data;
  const { firstname, lastname, email, url_name } = user;

  const error = {
    flag: false,
    user: "",
    repos: [],
  };

  let updatedUser;
  try {
    const [{ _pwhash, _pwsalt, ...u }] = await sql`
      UPDATE 
        users
      SET
        firstname = ${firstname},
        lastname = ${lastname},
        email = ${email},
        url_name = ${url_name}
      WHERE
        email = ${state.email}
      RETURNING
        *;`;
    updatedUser = u;
  } catch (error) {
    console.log(error);
    error.flag = true;
    error.user = "email or url name might already be in use";
    updatedUser = user;
  }

  state.email = updatedUser.email;

  await setJWT({ email: state.email }, cookies);//in case user changed their email

  const newRepos = await Promise.all(
    repos.map(r => {
      try {
        const [result] = sql`
          UPDATE
            projects
          SET
            owner = ${r.owner},
            name = ${r.name},
            full_name = ${r.full_name},
            description = ${r.description},
            languages = ${r.languages},
            html_url = ${r.html_url},
            created_at = ${r.created_at},
            visible = ${r.visible}
          WHERE
            id = ${r.id}
          RETURNING
            *;`;
        return result;
      } catch (error) {
        console.log(error);
        error.flag = true;
        error.repos.push(r);
        return null;
      }
    })
  );
  const updatedRepos = newRepos.filter(r => r !== null);

  if (error.flag) {
    response.status = 207;
    return response.body = { ...updatedUser, repos: updatedRepos, error };
  }

  response.status = 200;
  response.body = { ...updatedUser, repos: updatedRepos };
});


router.get("/users/:urlName", async ({ response, params }) => {
  let userData;
  let repoData;
  try {
    const userRows = await sql`
      SELECT
        firstname, lastname, email, github, url_name
      FROM
        users
      WHERE
        url_name = ${params.urlName};`;
    
    if (userRows.length === 0) {
      response.status = 404;
      return response.body = { error: "user not found" };
    }

    userData = userRows[0];

    repoData = await sql`
      SELECT * FROM projects WHERE user_email = ${userData.email} AND visible=true;`;
  } catch (error) {
    console.log(error);
    response.body = { error: "data fetch error" };
    return response.status = 500;
  }
  response.status = 200;
  response.body = { ...userData, repos: repoData };
});


router.post("/users", async ({ request, response, state, cookies }) => {
  if (state.email) {
    response.status = 409;
    return response.body = { errors: ["already logged in"] };
  }

  const body = request.body({ type: "json" });
  const data = await body.value;
  const { firstname, lastname, email, password } = data;

  const errors = [];
  if (firstname === undefined || typeof(firstname) !== "string" || firstname.length < 2) {
    errors.push("invalid or missing first name");
  }
  if (lastname === undefined || typeof(lastname) !== "string" || lastname.length < 2) {
    errors.push("invalid or missing last name");
  }
  if (email === undefined || typeof(email) !== "string" || email.length < 6) {
    errors.push("invalid or missing email");
  }
  if (password === undefined || typeof(password) !== "string" || password.length < 6) {
    errors.push("invalid or missing password");
  }

  if (errors.length > 0) {
    response.body = { errors };
    return response.status = 400;
  }

  const uint8salt = scrypt.genSalt(8, "Uint8Array");
  const passwordsalt = Array.from(uint8salt).map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
  const passwordhash = scrypt.hash(password + passwordsalt, "scrypt");

  let userRow;

  try {
    userRow = await sql`INSERT INTO users (firstname, lastname, email, pwhash, pwsalt) VALUES (
      ${firstname},
      ${lastname},
      ${email},
      ${passwordhash},
      ${passwordsalt}
    ) RETURNING *;`;
  } catch (_e) {
    response.status = 400;
    return response.body = { errors: ["email already in use"] };
  }
  const { _pwhash, _pwsalt, ...user } = userRow[0];

  try {
    await setJWT(user, cookies);
  } catch (_e) {
    response.status = 500;
    return response.body = { errors: ["JWT creation error"] };
  }

  response.status = 200;
  response.body = { ...user, repos: [] };
});


router.post("/login", async ({ request, response, cookies }) => {
  const body = request.body({ type: "json" });
  const data = await body.value;
  const { email, password } = data;

  const errors = [];

  if (!email) {
    errors.push("email missing");
  }
  if (!password) {
    errors.push("password missing")
  }

  if (errors.length > 0) {
    response.status = 400;
    return response.body = { errors };
  }
  let rows;
  try {
    rows = await sql`SELECT firstname, pwsalt, pwhash, lastname, email, github, url_name FROM users WHERE email = ${email};`;
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }

  if (!rows[0]) {
    response.status = 401;
    return response.body = { errors: ["invalid credentials"] };
  }

  const { pwsalt, pwhash, ...user } = rows[0];
  const match = scrypt.verify(password + pwsalt, pwhash, "scrypt");

  if (!match) {
    response.status = 401;
    return response.body = { errors: ["invalid credentials"] };
  }

  try {
    await setJWT(user, cookies);
  } catch (_e) {
    response.status = 500;
    return response.body = { errors: ["JWT creation error"] };
  }

  let repos;
  try {
    repos = await sql`SELECT * FROM projects WHERE user_email = ${user.email};`;
  } catch (error) {
    console.log(error);
    return response.status = 403;
  }

  response.status = 201;
  response.body = { ...user, repos };
});


router.post("/logout", ({ response, state, cookies }) => {
  if (!state.email) {
    return response.status = 401;
  }

  cookies.delete("token");
  response.status = 204;
});


export default router;