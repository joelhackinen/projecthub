import { sql } from "../database.js";
import {
  Router,
  validate,
  isArray,
  firstMessages,
} from "../deps.js";
import { validateRepo } from "../utils/validations.js";
import { BASE_URL } from "../utils/index.ts";

const router = new Router();

router.post(`${BASE_URL}/repos/many`, async ({ request, response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const data = await body.value;

  const [passes, errors] = await validate({ data }, { data: [isArray] });

  if (!passes) {
    console.log(errors);
    response.body = { error: firstMessages(errors) };
    return response.status = 400;
  }

  response.status = 201;

  const repoErrors = [];

  const validateAndInsert = async (repo) => {
    const [passes, errors] = await validateRepo(repo);

    if (!passes) {
      response.status = 207;
      repoErrors.push(firstMessages(errors));
      return null;
    }

    const { owner, name, full_name, html_url, created_at, languages, github } = repo;

    let addedRepo;
    try {
      [addedRepo] = await sql`
        INSERT INTO projects
          (user_email, owner, name, full_name, html_url, created_at, languages, github)
        VALUES (
          ${state.email},
          ${owner},
          ${name},
          ${full_name},
          ${html_url},
          ${created_at},
          ${languages},
          ${github}
        ) RETURNING *;`;
    } catch (error) {
      if (error.code == "23505" || error.code == "23000" || error.code == "23001") {
        repoErrors.push({ name: `you already have a project named ${name}` });
      }
      response.status = 207;
      return null;
    }
    return addedRepo;
  };

  const items = await Promise.all(data.map(repo => validateAndInsert(repo)));
  response.body = { added: items.filter(r => r !== null), errors: repoErrors };
});


router.post(`${BASE_URL}/repos`, async ({ request, response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const data = await body.value;

  const [ passes, errors ] = await validateRepo(data);

  if (!passes) {
    console.log(errors);
    response.body = { error: firstMessages(errors) };
    return response.status = 400;
  }

  const { owner, name, full_name, description, html_url, created_at, languages, visible } = data;

  let addedRepo;
  try {
    [addedRepo] = await sql`
      INSERT INTO
        projects (user_email, owner, name, full_name, description, languages, html_url, created_at, visible, github)
      VALUES (
        ${state.email},
        ${owner},
        ${name},
        ${full_name},
        ${description},
        ${languages},
        ${html_url},
        ${created_at},
        ${visible},
        ${false}
      ) RETURNING *;`;
  } catch (error) {
    console.log(error);
    if (error.code == "23505") {
      response.body = { error: { name: `you already have a project named ${name}` } };
      return response.status = 400;
    }
    return response.status = 500;
  }

  response.status = 201;
  response.body = addedRepo;
});


router.delete(`${BASE_URL}/repos/:id`, async ({ response, state, params }) => {
  if (!state.email) {
    return response.status = 401;
  }

  let deletedRepo;
  try {
    [deletedRepo] = await sql`
      DELETE FROM
        projects
      WHERE
        id = ${params.id}
      AND
        user_email = ${state.email}
      RETURNING
        *;`;
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }
  if (!deletedRepo) {
    response.body = { error: { unknown: "project not found" } };
    return response.status = 400;
  }
  response.status = 200;
  response.body = deletedRepo;
});


router.put(`${BASE_URL}/repos/:id`, async ({ request, response, state, params }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const repoData = await body.value;

  const [passes, errors] = await validateRepo(repoData);

  if (!passes) {
    console.log(errors);
    response.body = { error: firstMessages(errors) };
    return response.status = 400;
  }

  const { owner, name, full_name, description, languages, html_url, created_at, visible } = repoData;

  let updatedRepo;
  try {
    [updatedRepo] = await sql`
      UPDATE 
        projects
      SET
        owner = ${owner},
        name = ${name},
        full_name = ${full_name},
        description = ${description},
        languages = ${languages},
        html_url = ${html_url},
        created_at = ${created_at},
        visible = ${visible}
      WHERE
        id = ${params.id}
      AND
        user_email = ${state.email}
      RETURNING
        *;`;
  } catch (error) {
    if (error.code == "23505") {
      response.body = { error: { name: `you already have a project named ${name}` } };
      return response.status = 400;
    }
    return response.status = 500;
  }
  if (!updatedRepo) {
    response.body = { error: { unknown: "project not found" } };
    return response.status = 400;
  }

  response.body = updatedRepo;
  return response.status = 200;
});


export default router;