import { verify, decode } from "../deps.js";
import { key } from "../app.js";

export const checkAuth = async ({ cookies, state }, next) => {
  const getPayloadFromToken = async (token) => {
    try {
      if (Deno.args[0] === "production") {
        return await verify(token, key);
      }
      const [_header, _payload, _signature] = decode(token);
      return _payload;
    } catch (_error) {
      return null;
    }
  };

  const token = await cookies.get("token");
  const payload = await getPayloadFromToken(token);

  console.log(payload);
  if (payload && payload.exp * 1000 >= Date.now() && "email" in payload) {
    state.email = payload.email;
  }

  await next();
};
