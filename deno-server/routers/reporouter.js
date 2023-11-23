import { sql } from "../database.js";
import {
  Router,
  isString,
  required,
  validate,
  lengthBetween,
  isBool,
  isArray,
  isDate,
} from "../deps.js";
import { isLanguages } from "../utils.js";

const router = new Router();

router.post("/repos/many", async ({ request, response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const data = await body.value;

  const repoData = { repos: data };

  const validationRules = {
    repos: [isArray],
  };

  const [passes, errors] = await validate(repoData, validationRules);

  if (!passes) {
    console.log(errors);
    response.status = 400;
    return response.body = { error: errors };
  }

  response.status = 201;

  const repoValidationRules = {
    owner: [required, isString],
    name: [required, isString, lengthBetween(2, 30)],
    full_name: [required, isString],
    html_url: [required, isString],
    created_at: [required, isDate],
    languages: [isLanguages],
    github: [required, isBool],
  };

  const repoErrors = [];

  const validateAndInsert = async (repo) => {
    const [passes, errors] = await validate(repo, repoValidationRules);

    if (!passes) {
      response.status = 207;
      repoErrors.push(errors);
      return null;
    }

    const { owner, name, full_name, html_url, created_at, languages, github } = repo;

    let addedRepo;
    try {
      [addedRepo] = await sql`
        INSERT INTO projects
          (user_email, owner, name, full_name, html_url, created_at, languages, github)
        VALUES
          (${state.email}, ${owner}, ${name}, ${full_name}, ${html_url}, ${created_at}, ${languages}, ${github})
        RETURNING *;`
    } catch (error) {
      if (error.code == "23505" || error.code == "23000" || error.code == "23001") {
        repoErrors.push({ name: { unique: `you already have a project named ${name}` } });
      }
      response.status = 207;
      return null;
    }
    return addedRepo;
  };

  const items = await Promise.all(data.map(repo => validateAndInsert(repo)));
  response.body = { added: items.filter(r => r !== null), errors: repoErrors };
});


router.post("/repos", async ({ request, response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const data = await body.value;

  const validationRules = {
    owner: [isString],
    name: [required, isString, lengthBetween(2, 30)],
    full_name: [isString],
    description: [isString],
    html_url: [isString],
    created_at: [isDate],
    languages: [isLanguages],
    visible: [isBool],
  };

  const [ passes, errors ] = await validate(data, validationRules);

  if (!passes) {
    console.log(errors);
    response.status = 400;
    return response.body = { error: errors };
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
    if (error.code == "23505") {
      response.body = { error: { name: { unique: `you already have a project named ${name}` }}};
    }
    console.log(error)
    return response.status = 400;
  }

  response.status = 201;
  response.body = addedRepo;
});


router.delete("/repos/:id", async ({ response, state, params }) => {
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
    response.status = 500;
    return response.body = { error: "error deleting project" };
  }
  response.status = 200;
  response.body = deletedRepo;
});


router.put("/repos/:id", async ({ request, response, state, params }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const r = await body.value;

  const validationRules = {
    owner: [isString],
    name: [required, isString, lengthBetween(2, 30)],
    full_name: [isString],
    description: [isString],
    html_url: [isString],
    created_at: [isDate],
    visible: [isBool],
  };

  const [passes, errors] = await validate(r, validationRules);

  if (!passes) {
    console.log(errors);
    response.status = 400;
    return response.body = errors;
  }

  let updatedRepo;
  try {
    [updatedRepo] = await sql`
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
  } catch (error) {
    if (error.code == "23505") {
      response.body = { error: { name: { unique: `you already have a project named ${name}` } } };
      return response.status = 400;
    }
    response.body = { error: { unknown: { unknown: "unknown error" } } };
    return response.status = 500;
  }
  if (!updatedRepo) {
    response.status = 400;
    return response.body = { error: { notfound: { notfound: "project not found" } } };
  }

  response.status = 200;
  return response.body = updatedRepo;
});


export default router;