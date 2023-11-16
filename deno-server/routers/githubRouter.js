import { Router } from "../deps.js";
import { sql } from "../database.js";

const CLIENT_ID = Deno.env.get("CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("CLIENT_SECRET");

const router = new Router();

router.post("/github/verifyUser", async ({ request, response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }
  const body = request.body({ type: "json" });
  const { code } = await body.value;

  if (!code) {
    response.status = 400;
    return response.body = { error: "No auth code found" };
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
  if (typeof(data) !== "object" || !("access_token" in data)) {
    response.status = 401;
    return response.body = { error: "Authentication failed" };
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
    response.status = 401;
    return response.body = { error: "Authentication failed" };
  }

  const userData = await userResponse.json();

  try {
    await sql`UPDATE users SET github = ${userData.login} WHERE email = ${state.email};`;
  } catch(e) {
    console.log(e);
    response.status = 400;
    return response.body = { error: "error updating the user" };
  }

  response.status = 200;
  response.body = { github_token: data.access_token };
});


router.post("/github/fetchRepos", async ({ request, response, state }) => {
  if (!state.email) {
    return response.status = 401;
  }

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
    response.status = 400;
    return response.body = { error: "error fetching repos from github" };
  }

  const repoData = await repoResponse.json();

  let existingRepos;
  try {
    existingRepos = await sql`SELECT * FROM projects WHERE user_email = ${state.email};`;
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }

  const repos = repoData.map(r => ({
    owner: r.owner.login,
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    created_at: r.created_at,
  }));

  const existingRepoNames = existingRepos.map(r => r.name);

  response.status = 200;
  response.body = repos.filter(r => !existingRepoNames.includes(r.name));
});

export default router;