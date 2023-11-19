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
    response.status = 401;
    return response.body = { error: "unauthorized" };
  }

  const body = request.body({ type: "json" });
  const data = await body.value;
  const { firstname, lastname, email, url_name, repos } = data;

  let updatedUserRow;
  try {
    updatedUserRow = await sql`
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
  } catch (error) {
    console.log(error);
    response.status = 500;
    return response.body = { error: "email or url name might already be in use" };
  }
  const { _pwhash, _pwsalt, ...updatedUser } = updatedUserRow[0];
  state.email = updatedUser.email;

  try {
    await setJWT({ email: state.email }, cookies);//in case user changed their email
  } catch (_e) {
    response.status = 500;
    return response.body = { error: "JWT creation error" };
  }

  let updatedRepos;
  try {
    updatedRepos = await Promise.all(
      repos.map(({ id, owner, name, full_name, description, languages, html_url, created_at, visible }) => sql`
        UPDATE
          projects
        SET
          owner = ${owner},
          name = ${name},
          full_name = ${full_name},
          description = ${description},
          languages = ${languages},
          html_url = ${html_url},
          created_at = ${created_at},
          visible = ${visible}
        WHERE
          id = ${id}
        RETURNING
          *;`
      )
    );
  } catch (error) {
    console.log(error);
    response.status = 500;
    return response.body = { error: "error updating projects" };
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