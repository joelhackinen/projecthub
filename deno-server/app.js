import { Application, send } from "./deps.js";
import githubRouter from "./routers/githubRouter.js";
import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";
import repoRouter from "./routers/repoRouter.js";
import publicRouter from "./routers/publicRouter.js";
import { checkAuth } from "./middleware/index.js";

export const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const app = new Application();

if (Deno.args[0] === "production") {
  app.use(async (context, next) => {
    const { request } = context;
    if (request.url.pathname.startsWith("/api")) {
      await next();
      return;
    }

    const extensions = [".js", ".css", ".jpg", ".jpeg", ".png", ".gif", ".svg"];
    if (extensions.some(ext => request.url.pathname.endsWith(ext))) {
      await send(context, request.url.pathname, {
        root: `${Deno.cwd()}/public`,
      });
      return;
    }

    await send(context, "/index.html", {
      root: `${Deno.cwd()}/public`,
      index: "index.html"
    });
    return;
  });
}

app.use(publicRouter.routes());
app.use(checkAuth);
app.use(userRouter.routes());
app.use(authRouter.routes());
app.use(githubRouter.routes());
app.use(repoRouter.routes());

await app.listen({ port: 4000, hostname: "0.0.0.0" });