import { Router } from "../deps.js";
import { sql } from "../database.js";

const CLIENT_ID = Deno.env.get("CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("CLIENT_SECRET");

const router = new Router();

router.post("/github/verifyUser", async (context) => {
  const { request, response } = context;
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
    await sql`UPDATE users SET github = ${userData.login} WHERE email = ${context.state.email};`;
  } catch(e) {
    console.log(e);
    response.status = 400;
    return response.body = { error: "error updating the user" };
  }

  response.status = 200;
  response.body = userData;
});

export default router;