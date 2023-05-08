import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Response => {
  const method = _req.method.toLowerCase();
  if (method === `post`) {
    const kv = await Deno.openKv();
    const requestJson = await _req.json();

    if (
      typeof requestJson.name !== `string` ||
      typeof requestJson.text !== `string` ||
      requestJson.name.length > 50 ||
      requestJson.text.length > 50
    ) {
      return new Response(
        JSON.stringify({
          success: false,
        }),
        {
          status: 400,
        },
      );
    }

    await kv.set(
      [`chat`, new Date().toISOString(), requestJson.name],
      requestJson.text,
    );
    return new Response(JSON.stringify({
      success: true,
    }));
  } else if (method === `delete`) {
    const kv = await Deno.openKv();
    const body = await _req.json();
    if (body.secret !== `test`) {
      return new Response(JSON.stringify({
        success: false,
      }));
    }

    const iter = await kv.list<string>({ prefix: ["chat"] });

    for await (const res of iter) await kv.delete(res.key);

    return new Response(JSON.stringify({
      success: true,
    }));
  } else {
    const kv = await Deno.openKv();
    const iter = await kv.list<string>({ prefix: ["chat"] });

    const list = [];
    for await (const res of iter) list.unshift(res);

    return new Response(JSON.stringify({
      list: list,
      success: true,
    }));
  }
};
