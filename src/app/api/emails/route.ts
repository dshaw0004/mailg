import { NextRequest, NextResponse } from "next/server";

interface Env {
    DB?: D1Database;
    MAILGUN_API_KEY?: string;
    MAILGUN_DOMAIN?: string;
}

export async function GET(request: NextRequest) {
    try {
        const env = process.env as any as Env;

        if (!env.DB) {
            console.error("D1 database not configured");
            return NextResponse.json(
                { error: "Database not configured", results: [] },
                { status: 200 }
            );
        }

        return await handleListEmails(env);
    } catch (error) {
        console.error("Error in GET /api/emails:", error);
        return NextResponse.json({ error: "Internal server error", results: [] }, { status: 200 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const env = process.env as any as Env;
        return await handleSendEmail(request, env);
    } catch (error) {
        console.error("Error in POST /api/emails:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

async function handleListEmails(env: Env) {
    try {
        const result = await env.DB!.prepare(
            `SELECT id, message_id, \`from\`, \`to\`, subject, date, timestamp, body_plain,
				(SELECT COUNT(*) FROM attachments WHERE attachments.message_id = emails.message_id) as attachment_count
			FROM emails
			ORDER BY timestamp DESC`
        ).all();

        return NextResponse.json(result.results || []);
    } catch (error) {
        console.error("Database query error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

async function handleSendEmail(request: NextRequest, env: Env) {
    const apiKey = env.MAILGUN_API_KEY;
    const domain = env.MAILGUN_DOMAIN;

    if (!apiKey || !domain) {
        return NextResponse.json({ error: "Mailgun not configured" }, { status: 500 });
    }

    const body = (await request.json()) as {
        to: string;
        from?: string;
        subject: string;
        text: string;
        html?: string;
    };

    if (!body.to || !body.subject) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
        return NextResponse.json({ error: err }, { status: resp.status });
    }

    const result = await resp.json();
    return NextResponse.json(result);
}
