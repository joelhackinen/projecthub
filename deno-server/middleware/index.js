import { verify, decode } from "../deps.js";
import { key } from "../app.js";

export const checkAuth = async ({ response, cookies, state }, next) => {
  const getPayloadFromToken = async (token) => {
    try {
      if (Deno.env.get("MODE") === "production") {
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
  if (!payload || payload.exp * 1000 < Date.now()) {
    response.body = { error: { auth: "not authorized" }  };
    return response.status = 401;
  }
  state.email = payload.email;

  await next();
};