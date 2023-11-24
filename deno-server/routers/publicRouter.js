import {
  Router,
  scrypt,
  isEmail,
  isString,
  required,
  validate,
  lengthBetween,
  firstMessages,
} from "../deps.js";
import { omit, setJWT } from "../utils.ts";
import { sql } from "../database.js";

const router = new Router();

router.get("/users/:urlName", async ({ response, params }) => {
  let userData;
  let repoData;
  try {
    const [user] = await sql`
      SELECT
        *
      FROM
        users
      WHERE
        url_name = ${params.urlName};`;
    
    if (!user) {
      response.body = { error: "user not found" };
      return response.status = 404;
    }

    userData = omit(user, "id", "pwhash", "pwsalt");

    repoData = await sql`
      SELECT
        *
      FROM
        projects
      WHERE
        user_email = ${userData.email}
      AND
        visible=true;`;
  } catch (error) {
    console.log(error);
    response.body = { error: { unknown: "data fetch error" } };
    return response.status = 500;
  }
  response.status = 200;
  response.body = { ...userData, repos: repoData };
});


router.post("/users", async ({ request, response, cookies }) => {
  const body = request.body({ type: "json" });
  const userData = await body.value;

  const validationRules = {
    firstname: [required, isString, lengthBetween(2, 30)],
    lastname: [required, isString, lengthBetween(2, 30)],
    email: [required, isEmail],
    password: [required, isString, lengthBetween(6, 30)],
  };

  const [ passes, errors ] = await validate(userData, validationRules);

  if (!passes) {
    console.log(errors);
    response.body = { error: firstMessages(errors) };
    return response.status = 400;
  }

  const { firstname, lastname, email, password } = userData;

  const uint8salt = scrypt.genSalt(8, "Uint8Array");
  const passwordsalt = Array.from(uint8salt).map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
  const passwordhash = scrypt.hash(password + passwordsalt, "scrypt");

  let user;

  try {
    const [u] = await sql`
      INSERT INTO
        users (firstname, lastname, email, pwhash, pwsalt)
      VALUES (
        ${firstname},
        ${lastname},
        ${email},
        ${passwordhash},
        ${passwordsalt}
      ) RETURNING *;`;
    user = omit(u, "id", "pwhash", "pwsalt");
  } catch (error) {
    console.log(error);
    if (error.code == "23505") {
      response.body = { error: { email: "email already in use" } };
      return response.status = 400;
    }
    return response.status = 500;
  }

  try {
    await setJWT(user.email, cookies);
  } catch (_e) {
    response.status = 500;
    return response.body = { error: { unknown: "unexpected error" } };
  }

  response.status = 200;
  response.body = { ...user, repos: [] };
});


router.post("/login", async ({ request, response, cookies }) => {
  const body = request.body({ type: "json" });
  const data = await body.value;
  const { email, password } = data;

  const validationRules = {
    email: [required],
    password: [required],
  };

  const [ passes, errors ] = await validate(data, validationRules);

  if (!passes) {
    console.log(errors);
    response.status = 400;
    return response.body = { error: firstMessages(errors) };
  }

  let userData;
  try {
    [userData] = await sql`
      SELECT * FROM users WHERE email = ${email};`;
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }

  if (!userData) {
    response.body = { error: { auth: "invalid credentials" } };
    return response.status = 401;
  }

  const { pwsalt, pwhash, ...user } = omit(userData, "id");
  const match = scrypt.verify(password + pwsalt, pwhash, "scrypt");

  if (!match) {
    response.body = { error: { auth: "invalid credentials" } };
    return response.status = 401;
  }

  try {
    await setJWT(user.email, cookies);
  } catch (error) {
    console.log(error);
    response.body = { error: { unknown: "unexpected error" } };
    return response.status = 500;
  }

  let repos;
  try {
    repos = await sql`SELECT * FROM projects WHERE user_email = ${user.email};`;
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }

  response.status = 200;
  response.body = { ...user, repos };
});

export default router;