export const config = {
  path: "/api/attachments/:key",
};

export interface Env {
  ATTACHMENTS: R2Bucket;
}

export default async function handler(
  request: Request,
  env: Env,
  context: { params: { key: string } }
): Promise<Response> {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const key = decodeURIComponent(context.params.key);
  return await handleGetAttachment(env, key);
}

async function handleGetAttachment(env: Env, key: string) {
  const r2Key = `/mailg/${key}`;
  const obj = await env.ATTACHMENTS.get(r2Key);
  if (!obj) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set(
    "content-disposition",
    `inline; filename="${key.split("/").pop()}"`
  );

  return new Response(obj.body, { headers });
}
