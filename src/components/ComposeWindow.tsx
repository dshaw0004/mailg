import { useState } from 'react';
import { useMail } from '../context/MailContext';
import clsx from 'clsx';

export default function ComposeWindow() {
  const { composeState, closeCompose, toggleMinimizeCompose } = useMail();
  const [isFocused, setIsFocused] = useState(false);
  const [formData, setFormData] = useState({ to: '', subject: '', body: '' });

  const { isOpen, isMinimized } = composeState;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate send
    setTimeout(() => {
      closeCompose();
      setFormData({ to: '', subject: '', body: '' });
    }, 400);
  };

  return (
    <div
      className={clsx(
        "fixed bottom-0 right-24 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl flex flex-col bg-neutral-900 border border-white/10 overflow-hidden",
        isMinimized ? "w-80 h-[48px] rounded-t-xl" : "w-[500px] h-[600px] rounded-t-xl animate-slide-up"
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "flex items-center justify-between px-4 h-[48px] cursor-pointer transition-colors duration-200 flex-shrink-0",
          isMinimized ? "bg-neutral-800 hover:bg-neutral-700" : "bg-neutral-900/50 backdrop-blur border-b border-white/[0.06]"
        )}
        onClick={isMinimized ? toggleMinimizeCompose : undefined}
      >
        <span className="text-sm font-medium text-neutral-200">
          {isMinimized ? 'New Message' : 'New Message'}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); toggleMinimizeCompose(); }}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <iconify-icon icon={isMinimized ? "solar:maximize-linear" : "solar:minimize-linear"} style={{ fontSize: '16px' }} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); closeCompose(); }}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <iconify-icon icon="solar:close-circle-linear" style={{ fontSize: '16px' }} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 bg-neutral-950 relative">
          <div className="px-4 py-2 border-b border-white/[0.06] flex items-center group">
            <span className="text-neutral-500 text-sm w-12 group-focus-within:text-neutral-300 transition-colors">To:</span>
            <input
              type="email"
              required
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-200"
              autoFocus
            />
          </div>

          <div className="px-4 py-2 border-b border-white/[0.06] flex items-center group">
            <span className="text-neutral-500 text-sm w-12 group-focus-within:text-neutral-300 transition-colors">Sub:</span>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-200"
            />
          </div>

          <textarea
            className="flex-1 w-full bg-transparent p-4 resize-none outline-none text-sm text-neutral-200"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Footer Actions */}
          <div className={clsx(
            "p-3 flex items-center justify-between border-t border-white/[0.06] bg-neutral-900 transition-colors duration-300",
            isFocused && "bg-neutral-800/50"
          )}>
            <div className="flex items-center gap-1">
              <IconButton icon="solar:text-bold-linear" />
              <IconButton icon="solar:link-linear" />
              <IconButton icon="solar:gallery-wide-linear" />
              <IconButton icon="solar:smile-circle-linear" />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-white text-neutral-950 text-sm font-medium rounded-lg hover:bg-neutral-200 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              Send
              <iconify-icon icon="solar:plain-2-linear" style={{ fontSize: '16px' }} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function IconButton({ icon }: { icon: string }) {
  return (
    <button type="button" className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors active:scale-95">
      <iconify-icon icon={icon} style={{ fontSize: '18px' }} />
    </button>
  );
}
