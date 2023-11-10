import { sql } from "../database.js";
import { Router } from "../deps.js";

const router = new Router();

router.get("/whoami", async (context) => {
  const { response } = context;
  const email = context.state.email;

  let userRow;

  try {
    userRow = await sql`SELECT firstname, lastname, email, github, url_name FROM users WHERE email = ${email};`;
  } catch(_e) {
    return response.status = 401;
  }
  
  response.status = 200;
  response.body = userRow[0];
});

export default router;