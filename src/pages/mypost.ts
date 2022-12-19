import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
    //if (request.headers.get("Content-Type") === "application/json") {
      const body = await request.json();
      const name = body.name;
      const trx = [name, "234", '334', "345"]
      return new Response(JSON.stringify({
        message: trx
      }), {
        status: 200
      })
    //}
    return new Response(null, { status: 400 });
  }
  