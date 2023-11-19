import { sql } from "../database.js";
import { Router } from "../deps.js";

const router = new Router();

router.post("/repos", async ({ request, response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const data = await body.value;
  
  let items;
  if (Array.isArray(data)) {
    try {
      const rows = await Promise.all(data.map(({owner, name, full_name, html_url, created_at}) => sql`
        INSERT INTO projects
          (user_email, owner, name, full_name, html_url, created_at)
        VALUES
          (${state.email}, ${owner}, ${name}, ${full_name}, ${html_url}, ${created_at})
        RETURNING *;`
      ));
      items = rows.flat();
    } catch (error) {
      console.log(error);
      return response.status = 500;
    }
    response.status = 201;
    return response.body = items;
  }

  try {
    const { owner, name, full_name, html_url, created_at } = data;
    items = await sql`
      INSERT INTO projects
        (user_email, owner, name, full_name, html_url, created_at)
      VALUES
        (${state.email}, ${owner}, ${name}, ${full_name}, ${html_url}, ${created_at})
      RETURNING *;`
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }

  response.status = 201;
  response.body = items;
});

router.delete("/repos", async ({ request, response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const repoToDelete = await body.value;

  let deletedRepo;
  try {
    const row = await sql`
      DELETE FROM
        projects
      WHERE
        id = ${repoToDelete.id}
      AND
        user_email = ${state.email}
      RETURNING
        *;`;
    deletedRepo = row[0];
  } catch (error) {
    console.log(error);
    response.status = 500;
    return response.body = { error: "error deleting project" };
  }
  console.log(deletedRepo);
  response.status = 200;
  response.body = deletedRepo;
});


export default router;