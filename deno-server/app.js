import { Application, verify, decode } from "./deps.js";
import githubRouter from "./routers/githubRouter.js";
import userRouter from "./routers/userRouter.js";
import authRouter from "./routers/authRouter.js";

const MODE = Deno.env.get("MODE");

export const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const app = new Application();

const checkAuth = async (context, next) => {
  const getPayloadFromToken = async (token) => {
    try {
      if (MODE === "production") {
        return await verify(token, key);
      }
      const [_header, _payload, _signature] = decode(token);
      return _payload;
    } catch (_error) {
      return null;
    }
  };

  const token = await context.cookies.get("token");
  const payload = await getPayloadFromToken(token)

  console.log(payload);
  if (payload && payload.exp * 1000 >= Date.now()) {
    context.state.email = payload.email;
  }

  await next();
};

app.use(userRouter.routes());
app.use(checkAuth);
app.use(authRouter.routes());
app.use(githubRouter.routes());

await app.listen({ port: 4000, hostname: "0.0.0.0" });