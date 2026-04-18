import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface Env {
    DB: D1Database;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const env = process.env as any as Env;
        const { id } = await params;

        const emailResult = await env.DB.prepare(
            `SELECT message_id, \`from\`, \`to\`, subject, sender, recipient, body_plain, body_html, date, timestamp
			 FROM emails WHERE message_id = ?`
        ).bind(id).first();

        if (!emailResult) {
            return NextResponse.json({ error: "Email not found" }, { status: 404 });
        }

        const attachmentsResult = await env.DB.prepare(
            `SELECT id, r2_key, filename, content_type, size
			 FROM attachments WHERE message_id = ?`
        ).bind(id).all();

        const email = {
            message_id: emailResult.message_id,
            from: emailResult.from,
            to: emailResult.to,
            subject: emailResult.subject,
            sender: emailResult.sender,
            recipient: emailResult.recipient,
            body_plain: emailResult.body_plain,
            body_html: emailResult.body_html,
            date: emailResult.date,
            timestamp: emailResult.timestamp,
        };

        const attachments = (attachmentsResult.results || []).map((att: any) => ({
            id: att.id,
            r2_key: att.r2_key,
            filename: att.filename,
            content_type: att.content_type,
            size: att.size,
        }));

        return NextResponse.json({ email, attachments });
    } catch (error) {
        console.error("Failed to fetch email:", error);
        return NextResponse.json({ error: "Failed to fetch email" }, { status: 500 });
    }
}
