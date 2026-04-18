export const config = {
  path: "/api/emails/:id",
};

export interface Env {
  DB: D1Database;
}

export default async function handler(
  request: Request,
  env: Env,
  context: { params: { id: string } }
): Promise<Response> {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const messageId = decodeURIComponent(context.params.id);
  return await handleGetEmail(env, messageId);
}

async function handleGetEmail(env: Env, messageId: string) {
  const email = await env.DB.prepare(
    `SELECT * FROM emails WHERE message_id = ?`
  )
    .bind(messageId)
    .first();

  if (!email) {
    return new Response("Email not found", { status: 404 });
  }

  const { results: attachments } = await env.DB.prepare(
    `SELECT id, r2_key, filename, content_type, size FROM attachments WHERE message_id = ?`
  )
    .bind(messageId)
    .all();

  return new Response(JSON.stringify({ email, attachments }), {
    headers: { "Content-Type": "application/json" },
  });
}
