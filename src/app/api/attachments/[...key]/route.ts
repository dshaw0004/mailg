import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface Env {
    ATTACHMENTS: R2Bucket;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string[] }> }
) {
    try {
        const env = process.env as any as Env;
        const { key } = await params;
        const keyPath = key.join("/");
        const r2Key = `/mailg/${keyPath}`;

        const obj = await env.ATTACHMENTS.get(r2Key);
        if (!obj) {
            return new NextResponse("Not found", { status: 404 });
        }

        const headers = new Headers();
        obj.writeHttpMetadata(headers);
        headers.set("etag", obj.httpEtag || "");
        headers.set("content-disposition", `inline; filename="${keyPath.split("/").pop()}"`);

        return new NextResponse(obj.body, { headers });
    } catch (error) {
        console.error("Failed to fetch attachment:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
