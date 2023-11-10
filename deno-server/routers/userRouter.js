import { Router, scrypt, create, getNumericDate } from "../deps.js";
import { sql } from "../database.js";
import { key } from "../app.js";

const router = new Router();

const setJWT = async (user, context) => {
  const jwt = await create({ alg: "HS512", typ: "JWT" }, { email: user.email, exp: getNumericDate(60 * 60) }, key);
  context.cookies.set("token", jwt, { httpOnly: true })
};

router.post("/users", async (context) => {
  const { request, response } = context;
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

  await setJWT(userRow[0], context);

  response.status = 200;
  response.body = {
    firstname: userRow[0].firstname,
    lastname: userRow[0].lastname,
    email: userRow[0].email,
  };
});



router.post("/login", async (context) => {
  const { request, response } = context;
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

  const rows = await sql`SELECT * FROM users WHERE email=${email};`;
  const user = rows[0];
  
  let match;
  if (user) {
    match = scrypt.verify(password + user.pwsalt, user.pwhash, "scrypt");
  }

  if (!match) {
    response.status = 401;
    return response.body = { error: "invalid credentials" };
  }

  await setJWT(user, context);

  response.status = 200;
  response.body = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  };
});


export default router;