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

router.delete("/repos/:id", async ({ response, state, params }) => {
  if (!state.email) {
    return response.status = 401;
  }

  let deletedRepo;
  try {
    const row = await sql`
      DELETE FROM
        projects
      WHERE
        id = ${params.id}
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

router.put("/repos/:id", async ({ request, response, state, params }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const r = await body.value;

  let updatedRepo;
  try {
    const row = await sql`
      UPDATE 
        projects
      SET
        owner = ${r.owner},
        name = ${r.name},
        full_name = ${r.full_name},
        description = ${r.description},
        languages = ${r.languages},
        html_url = ${r.html_url},
        created_at = ${r.created_at},
        visible = ${r.visible}
      WHERE
        id = ${params.id}
      AND
        user_email = ${state.email}
      RETURNING
        *;`;
      updatedRepo = row[0];
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }
  if (!updatedRepo) {
    response.status = 400;
    return response.body = { error: "project to be updated wasn't found"};
  }

  response.status = 200;
  return response.body = updatedRepo;
});


export default router;