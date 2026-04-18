"use client";

import { useRouter } from "next/navigation";
import { useMail } from "@/context/MailContext";
import { Search, Settings, Bell } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useMail();

  return (
    <header className="h-[68px] flex-shrink-0 border-b border-white/[0.08] bg-neutral-950/80 backdrop-blur-md flex items-center justify-between px-6 z-20 sticky top-0">
      <div className="flex-1 max-w-2xl relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-white transition-colors duration-300">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search emails, contacts, or attachments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl py-2.5 pl-11 pr-4 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.06] focus:border-white/20 transition-all duration-300"
          suppressHydrationWarning
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-neutral-500 font-medium tracking-widest">
            <span>⌘</span><span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-6">
        <IconButton
          icon="solar:settings-linear"
          label="Settings"
          onClick={() => router.push("/settings")}
        />
        <IconButton icon="solar:bell-linear" label="Notifications" badge={2} />
      </div>
    </header>
  );
}

interface IconButtonProps {
  icon: string;
  label: string;
  badge?: number;
  onClick?: () => void;
}

function IconButton({ icon, label, badge, onClick }: IconButtonProps) {
  const iconMap: { [key: string]: React.ReactNode } = {
    "solar:settings-linear": <Settings size={22} />,
    "solar:bell-linear": <Bell size={22} />,
  };

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.06] transition-all duration-200 active:scale-95 group"
      aria-label={label}
      title={label}
    >
      <div className="transition-transform group-hover:rotate-12 duration-300">
        {iconMap[icon]}
      </div>
      {badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-neutral-950"></span>
      )}
    </button>
  );
}
