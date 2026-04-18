import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface Env {
    DB: D1Database;
    ATTACHMENTS: R2Bucket;
    MAILGUN_SIGNING_KEY?: string;
    MAILGUN_API_KEY?: string;
    MAILGUN_DOMAIN?: string;
}

async function verifyMailgunSignature(
    signingKey: string,
    timestamp: string,
    token: string,
    signature: string
): Promise<boolean> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(signingKey),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const data = encoder.encode(timestamp + token);
    const signatureBytes = await crypto.subtle.sign("HMAC", key, data);
    const computedSignature = Array.from(new Uint8Array(signatureBytes))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return computedSignature === signature;
}

function getField(fields: Record<string, string>, ...keys: string[]): string {
    for (const k of keys) {
        if (fields[k]) return fields[k];
    }
    return "";
}

function parseMessageHeaders(raw: string): Record<string, string> {
    try {
        const headers: [string, string][] = JSON.parse(raw);
        const map: Record<string, string> = {};
        for (const [name, value] of headers) {
            const lower = name.toLowerCase();
            if (!map[lower]) map[lower] = value;
        }
        return map;
    } catch {
        return {};
    }
}

export async function POST(request: NextRequest) {
    try {
        const env = process.env as any as Env;

        const contentType = request.headers.get("content-type") || "";

        if (
            !contentType.includes("multipart/form-data") &&
            !contentType.includes("application/x-www-form-urlencoded")
        ) {
            return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
        }

        const formData = await request.formData();
        const fields: Record<string, string> = {};
        const attachments: Array<{ name: string; type: string; size: number; data: ArrayBuffer }> = [];

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                attachments.push({
                    name: value.name,
                    type: value.type,
                    size: value.size,
                    data: await value.arrayBuffer(),
                });
            } else {
                fields[key] = value;
            }
        }

        const token = fields["token"] || "";
        const timestamp = fields["timestamp"] || "";
        const signature = fields["signature"] || "";

        try {
            await env.DB.prepare(`INSERT INTO temp_logs (log) VALUES (?)`).bind(JSON.stringify(fields)).run();
        } catch (err) {
            console.error("Failed to log webhook payload:", err);
        }

        if (env.MAILGUN_SIGNING_KEY) {
            const valid = await verifyMailgunSignature(env.MAILGUN_SIGNING_KEY, timestamp, token, signature);
            if (!valid) {
                return NextResponse.json({ error: "Forbidden: invalid signature" }, { status: 403 });
            }
        }

        const messageHeaders = fields["message-headers"] || "";
        const parsedHeaders = parseMessageHeaders(messageHeaders);

        const from = getField(fields, "from", "From") || parsedHeaders["from"] || "";
        const subject = getField(fields, "subject", "Subject") || parsedHeaders["subject"] || "";
        const to = getField(fields, "to", "To") || parsedHeaders["to"] || "";
        const date = getField(fields, "date", "Date") || parsedHeaders["date"] || "";
        const messageId =
            getField(fields, "Message-Id", "message-id") || parsedHeaders["message-id"] || `msg-${crypto.randomUUID()}`;

        const sender = fields["sender"] || "";
        const recipient = fields["recipient"] || "";
        const bodyPlain = fields["body-plain"] || "";
        const bodyHtml = fields["body-html"] || "";
        const strippedText = fields["stripped-text"] || "";
        const strippedHtml = fields["stripped-html"] || "";
        const strippedSignature = fields["stripped-signature"] || "";
        const parsedTimestamp = timestamp ? parseInt(timestamp, 10) : NaN;
        const timestampInt = Number.isFinite(parsedTimestamp) ? parsedTimestamp : Math.floor(Date.now() / 1000);
        const variables = fields["X-Mailgun-Variables"] || "";

        const receivedAt = new Date().toISOString();

        try {
            const { success: emailInserted } = await env.DB.prepare(
                `INSERT INTO emails (
					message_id, \`from\`, \`to\`, subject, sender, recipient,
					body_plain, body_html, stripped_text, stripped_html, stripped_signature,
					date, token, timestamp, signature, message_headers, variables, received_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
                messageId,
                from,
                to,
                subject,
                sender,
                recipient,
                bodyPlain,
                bodyHtml,
                strippedText,
                strippedHtml,
                strippedSignature,
                date,
                token,
                timestampInt,
                signature,
                messageHeaders,
                variables,
                receivedAt
            ).run();

            if (!emailInserted) {
                return NextResponse.json({ error: "Failed to insert email" }, { status: 500 });
            }
        } catch (err) {
            console.error("Failed to insert email:", err);
            return NextResponse.json({ error: "Failed to insert email" }, { status: 500 });
        }

        const attachmentRecords: Array<{ key: string; name: string; type: string; size: number }> = [];

        for (const att of attachments) {
            const key = `/mailg/${messageId.replace(/[<>]/g, "")}/${att.name}`;
            try {
                await env.ATTACHMENTS.put(key, att.data, {
                    httpMetadata: { contentType: att.type },
                });

                attachmentRecords.push({ key, name: att.name, type: att.type, size: att.size });
            } catch (err) {
                console.error(`Failed to upload attachment ${att.name}:`, err);
            }
        }

        for (const att of attachmentRecords) {
            try {
                await env.DB.prepare(
                    `INSERT INTO attachments (message_id, r2_key, filename, content_type, size) VALUES (?, ?, ?, ?, ?)`
                ).bind(messageId, att.key, att.name, att.type, att.size).run();
            } catch (err) {
                console.error(`Failed to insert attachment record for ${att.name}:`, err);
            }
        }

        return NextResponse.json({
            received: true,
            message_id: messageId,
            attachments: attachmentRecords.length,
        });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
