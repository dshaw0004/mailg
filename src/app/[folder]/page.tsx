"use client";

import { use } from "react";
import Mailbox from "@/components/pages/Mailbox";

export default function FolderPage({ params }: { params: Promise<{ folder: string }> }) {
    const { folder } = use(params);
    return <Mailbox folder={folder} />;
}
