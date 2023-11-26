import { postgres } from "./deps.js";
console.log(Deno.args[0])
const sql = Deno.args[0] === "production"
  ? postgres(Deno.env.get("PGURL"), { max: 2 })
  : postgres({ max: 2 });

export { sql };