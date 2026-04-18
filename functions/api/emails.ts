export const config = {
  path: "/api/emails",
};

export interface Env {
  DB: D1Database;
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
}

export default async function handler(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === "GET") {
    return await handleListEmails(env);
  }

  if (request.method === "POST") {
    return await handleSendEmail(request, env);
  }

  return new Response("Method not allowed", { status: 405 });
}

async function handleListEmails(env: Env) {
  const { results } = await env.DB.prepare(
    `SELECT id, message_id, \`from\`, \`to\`, subject, date, timestamp, body_plain,
			(SELECT COUNT(*) FROM attachments WHERE attachments.message_id = emails.message_id) as attachment_count
		FROM emails
		ORDER BY timestamp DESC`
  ).all();

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
}

async function handleSendEmail(request: Request, env: Env) {
  const apiKey = env.MAILGUN_API_KEY;
  const domain = env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    return new Response(JSON.stringify({ error: "Mailgun not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = (await request.json()) as {
    to: string;
    from?: string;
    subject: string;
    text: string;
    html?: string;
  };

  if (!body.to || !body.subject) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const form = new FormData();
  const fromAddr = body.from || `Mailbox <dmail@${domain}>`;
  form.append("from", fromAddr);
  form.append("to", body.to);
  form.append("subject", body.subject);
  form.append("text", body.text || "");
  if (body.html) {
    form.append("html", body.html);
  }

  const resp = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`api:${apiKey}`)}`,
    },
    body: form,
  });

  if (!resp.ok) {
    const err = await resp.text();
    return new Response(JSON.stringify({ error: err }), {
      status: resp.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await resp.json();
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
