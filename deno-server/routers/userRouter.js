import {
  Router,
  firstMessages,
} from "../deps.js";
import { omit, setJWT, BASE_URL } from "../utils/index.ts";
import { sql } from "../database.js";
import { validateUserEdit } from "../utils/validations.js";

const router = new Router();

router.put(`${BASE_URL}/users`, async ({ request, response, state, cookies }) => {
  if (!state.email) {
    return response.status = 401;
  }

  const body = request.body({ type: "json" });
  const userData = await body.value;

  const [ passes, errors ] = await validateUserEdit(userData);

  if (!passes) {
    response.body = { error: firstMessages(errors) };
    return response.status = 400;
  }

  const { firstname, lastname, email, url_name, about } = userData;

  let updatedUser;
  try {
    const [u] = await sql`
      UPDATE 
        users
      SET
        firstname = ${firstname},
        lastname = ${lastname},
        email = ${email},
        url_name = ${url_name},
        about = ${about}
      WHERE
        email = ${state.email}
      RETURNING
        *;`;

    updatedUser = omit(u, "pwhash", "pwsalt", "id");
  } catch (error) {
    if (error.code == "23505") {
      if (error.constraint_name.includes("email")) {
        response.body = { error: { email: "email already in use" } };
      }
      if (error.constraint_name.includes("url_name")) {
        response.body = { error: { url_name: "url already in use" } };
      }
      return response.status = 400;
    }
    return response.status = 500;
  }

  if (!updatedUser) {
    return response.status = 400;
  }

  state.email = updatedUser.email;

  try {
    await setJWT(updatedUser.email, cookies);//in case user changed their email
  } catch (error) {
    console.log(error);
    return response.status = 500;
  }

  response.status = 200;
  response.body = updatedUser;
});


export default router;