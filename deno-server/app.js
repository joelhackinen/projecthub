import { sql } from "./database.js";

const handleRoot = async (_request) => {
  return Response.json({ "data": "This message came from the deno-server" });
};

const handleDBTest = async (_request) => {
  const rows = await sql`SELECT * FROM test_table;`;
  console.log(rows);
  return Response.json(rows);
};

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    fn: handleRoot,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/dbtest" }),
    fn: handleDBTest,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
  }
};

const portConfig = { port: 4000, hostname: "0.0.0.0" };
Deno.serve(portConfig, handleRequest);