import { sql } from "../database.js";
import { Router } from "../deps.js";

const router = new Router();

router.get("/whoami", async ({ response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }

  let user;
  try {
    const userRow = await sql`SELECT firstname, lastname, email, github, url_name FROM users WHERE email = ${state.email};`;
    user = userRow[0];
  } catch(error) {
    console.log(error);
    return response.status = 401;
  }

  if (!user) return response.status = 401;

  let repos;
  try {
    repos = await sql`SELECT * FROM projects WHERE user_email = ${state.email};`;
  } catch (error) {
    console.log(error);
    return response.status = 403;
  }
  
  response.status = 200;
  response.body = { ...user, repos};
});

export default router;