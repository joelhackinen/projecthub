import { Application } from "./deps.js";
import githubRouter from "./routers/githubRouter.js";
import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";
import { checkAuth } from "./middleware/index.js";

export const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const app = new Application();

app.use(checkAuth);
app.use(userRouter.routes());
app.use(authRouter.routes());
app.use(githubRouter.routes());

await app.listen({ port: 4000, hostname: "0.0.0.0" });