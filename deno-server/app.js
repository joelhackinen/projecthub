import { sql } from "./database.js";
import { scrypt } from "./deps.js";

const handleRoot = (_request) => {
  return Response.json({ "data": "This message came from the deno-server" });
};

const handleDBTest = async (_request) => {
  const rows = await sql`SELECT * FROM test_table;`;
  return Response.json(rows);
};

const createUser = async (request) => {
  const data = await request.json();
  const { firstname, lastname, email, password, } = data;

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

  if (errors.length > 0) return Response.json({ errors }, { status: 400 });

  const uint8salt = scrypt.genSalt(8, "Uint8Array");
  const passwordsalt = Array.from(uint8salt).map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
  const passwordhash = scrypt.hash(password + passwordsalt, "scrypt");

  const userRow = await sql`INSERT INTO users (firstname, lastname, email, pwhash, pwsalt) VALUES (
    ${firstname},
    ${lastname},
    ${email},
    ${passwordhash},
    ${passwordsalt}
  ) RETURNING *;`;

  return Response.json(userRow[0], { status: 200 });
};

const login = async (request) => {
  const errors = [];
  const { email, password } = await request.json();
  if (email === undefined || email === "") {
    errors.push("email missing");
  }
  if (password === undefined || email === "") {
    errors.push("password missing")
  }

  if (errors.length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  const rows = await sql`SELECT * FROM users WHERE email=${email};`;
  const user = rows[0];
  
  let match;
  if (user) {
    match = scrypt.verify(password + user.pwsalt, user.pwhash, "scrypt");
  }

  if (!match) {
    return Response.json({ error: "invalid credentials" }, { status: 401 });
  }

  return Response.json({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  }, { status: 200 });
};

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    fn: handleRoot,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/dbtest" }),
    fn: handleDBTest,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/users" }),
    fn: createUser,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/login "}),
    fn: login,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
  }
};

const portConfig = { port: 4000, hostname: "0.0.0.0" };
Deno.serve(portConfig, handleRequest);