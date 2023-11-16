import { Router, scrypt, create, getNumericDate } from "../deps.js";
import { sql } from "../database.js";
import { key } from "../app.js";

const router = new Router();

const setJWT = async (user, cookies) => {
  const jwt = await create(
    { alg: "HS512", typ: "JWT" },
    { email: user.email, exp: getNumericDate(60 * 60) },
    key
  );

  cookies.set("token", jwt, { httpOnly: true })
};

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
  response.body = user;
});


router.post("/login", async ({ request, response, state, cookies }) => {
  if (state.email) {
    response.status = 409;
    return response.body = { errors: ["already logged in"] };
  }

  const body = request.body({ type: "json" });
  const data = await body.value;
  const { email, password } = data;

  const errors = [];

  if (email === undefined || email === "") {
    errors.push("email missing");
  }
  if (password === undefined || email === "") {
    errors.push("password missing")
  }

  if (errors.length > 0) {
    response.status = 400;
    return response.body = { errors };
  }

  const rows = await sql`SELECT firstname, pwsalt, pwhash, lastname, email, github, url_name FROM users WHERE email = ${email};`;

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
  
  response.status = 201;
  response.body = user;
});


router.post("/logout", ({ response, state, cookies }) => {
  if (!state.email) {
    return response.status = 401;
  }

  cookies.delete("token");
  response.status = 204;
});


export default router;