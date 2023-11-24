import { sql } from "../database.js";
import { Router } from "../deps.js";
import { omit } from "../utils.ts";

const router = new Router();

router.get("/whoami", async ({ response, state }) => {
  let user;
  try {
    [user] = await sql`SELECT * FROM users WHERE email = ${state.email};`;
  } catch(error) {
    console.log(error);
    return response.status = 500;
  }

  if (!user) {
    response.body = { error: { auth: "not authorized" }  };
    return response.status = 401;
  }

  const safeUser = omit(user, "id", "pwhash", "pwsalt");

  let repos;
  try {
    repos = await sql`SELECT * FROM projects WHERE user_email = ${state.email};`;
  } catch (error) {
    console.log(error);
    return response.status = 403;
  }
  
  response.status = 200;
  response.body = { ...safeUser, repos};
});

export default router;