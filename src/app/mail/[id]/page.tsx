"use client";

import { use } from "react";
import MailDetail from "@/components/pages/MailDetail";

export const runtime = "edge";

export default function MailDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <MailDetail id={id} />;
}
