import { sql } from "../database.js";
import { Router } from "../deps.js";

const router = new Router();

router.get("/whoami", async (context) => {
  const { response, state } = context;

  let userRow;

  try {
    userRow = await sql`SELECT firstname, lastname, email, github, url_name FROM users WHERE email = ${state.email};`;
  } catch(_e) {
    return response.status = 401;
  }
  
  response.status = 200;
  response.body = userRow[0];
});

export default router;