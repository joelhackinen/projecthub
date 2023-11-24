import { Router } from "../deps.js";
import { sql } from "../database.js";
import { isObject, isoToDate } from "../utils.ts";

const CLIENT_ID = Deno.env.get("CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("CLIENT_SECRET");

const router = new Router();

router.post("/github/verifyUser", async ({ request, response, state }) => {
  const body = request.body({ type: "json" });
  const { code } = await body.value;

  if (!code) {
    response.status = 400;
    return response.body = { error: { auth: "Github authentication failed" } };
  }

  const params = "?client_id=" + CLIENT_ID +
    "&client_secret=" + CLIENT_SECRET +
    "&code=" + code;

  const oauthRes = await fetch(`https://github.com/login/oauth/access_token${params}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
    },
  });

  const data = await oauthRes.json();
  if (!isObject(data) || !("access_token" in data)) {
    response.body = { error: { auth: "Github authentication failed" } };
    return response.status = 401;
  }

  const userResponse = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${data.access_token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!userResponse.ok) {
    response.body = { error: { auth: "Github authentication failed" } };
    return response.status = 500;
  }

  const userData = await userResponse.json();

  try {
    await sql`UPDATE users SET github = ${userData.login} WHERE email = ${state.email};`;
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }

  response.status = 200;
  response.body = { github_token: data.access_token, login: userData.login };
});


router.post("/github/fetchRepos", async ({ request, response, state }) => {
  const body = request.body({ type: "json" });
  const { github_token } = await body.value;

  const repoResponse = await fetch("https://api.github.com/user/repos?visibility=all", {
    method: "GET",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${github_token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!repoResponse.ok) {
    response.status = 500;
    return response.body = { error: { unknown: "error fetching repos from github" } };
  }

  const repoData = await repoResponse.json();

  let existingRepos;
  try {
    existingRepos = await sql`SELECT * FROM projects WHERE user_email = ${state.email};`;
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }

  const existingRepoNames = existingRepos.map(r => r.name);
  const newRepos = repoData.filter(r => !existingRepoNames.includes(r.name));

  const requests = newRepos.map(({ languages_url }) => 
    fetch(languages_url, {
      method: "GET",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${github_token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }).then(res => res.json())
  );

  let languages = [];
  try {
    languages = await Promise.all(requests);
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }

  const repos = newRepos.map(({ owner, name, full_name, html_url, created_at }, i) => ({
    owner: owner.login,
    name,
    full_name,
    html_url,
    created_at: isoToDate(created_at),
    github: true,
    languages: languages[i],
  }));

  response.status = 200;
  response.body = repos;
});

export default router;