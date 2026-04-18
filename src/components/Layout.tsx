"use client";

import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ComposeWindow from "./ComposeWindow";
import { useMail } from "@/context/MailContext";

export default function Layout({ children }: { children: ReactNode }) {
  const { composeState } = useMail();

  return (
    <div className="flex h-screen w-full bg-neutral-950 overflow-hidden text-neutral-200">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 border-l border-white/[0.08]">
        <Header />

        <main className="flex-1 overflow-hidden relative bg-[#0a0a0a] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          {children}
        </main>
      </div>

      {composeState.isOpen && <ComposeWindow />}
    </div>
  );
}
