import { sql } from "../database.js";
import { Router } from "../deps.js";

const router = new Router();

router.post("/repos", async ({ request, response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const repos = await body.value;

  let items;
  try {
    items = await Promise.all(repos.map(({owner, name, full_name, html_url, created_at}) => sql`
      INSERT INTO projects
        (user_email, owner, name, full_name, html_url, created_at)
      VALUES
        (${state.email}, ${owner}, ${name}, ${full_name}, ${html_url}, ${created_at})
      RETURNING *;`
    ));
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }
  response.status = 201;
  response.body = items.flat();
});


export default router;