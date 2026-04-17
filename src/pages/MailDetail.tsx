import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMail } from '../context/MailContext';
import { formatDate } from '../utils/helpers';
import clsx from 'clsx';

export default function MailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { emails, toggleRead, toggleStar, deleteEmail } = useMail();

  const email = emails.find(e => e.id === id);

  useEffect(() => {
    // Auto-mark as read when opening
    if (email && !email.isRead) {
      toggleRead(id!);
    }
  }, [id, email, toggleRead]);

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-500">
        Message not found.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] animate-fade-in relative z-0">
      {/* Top Toolbar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-white/[0.04] sticky top-0 bg-[#0a0a0a]/80 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
          >
            <iconify-icon icon="solar:arrow-left-linear" style={{ fontSize: '20px' }} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton icon="solar:archive-linear" tooltip="Archive" />
          <ToolbarButton icon="solar:info-circle-linear" tooltip="Report Spam" />
          <ToolbarButton
            icon="solar:trash-bin-trash-linear"
            tooltip="Delete"
            onClick={() => {
              deleteEmail(email.id);
              navigate(-1);
            }}
          />
          <div className="w-px h-5 bg-white/10 mx-2" />
          <ToolbarButton
            icon="solar:letter-unread-linear"
            tooltip="Mark unread"
            onClick={() => {
              toggleRead(email.id);
              navigate(-1);
            }}
          />
          <ToolbarButton
            icon="solar:clock-circle-linear"
            tooltip="Snooze"
          />
        </div>
      </div>

      {/* Email Content Container */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {/* Subject Line */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-medium tracking-tight text-white leading-tight">
              {email.subject}
            </h1>
            <div className="flex gap-2">
              {email.labels.map(label => (
                <span key={label} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-neutral-400 font-medium">
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Sender Info block */}
          <div className="flex items-start justify-between mb-8 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center text-lg text-white font-medium shadow-sm">
                {email.sender.charAt(0)}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-white">{email.sender}</span>
                  <span className="text-xs text-neutral-500">&lt;{email.senderEmail}&gt;</span>
                </div>
                <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1 cursor-pointer hover:text-neutral-300 transition-colors w-fit">
                  to me
                  <iconify-icon icon="solar:alt-arrow-down-linear" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <span className="text-xs group-hover:text-neutral-300 transition-colors">{formatDate(email.date, true)}</span>
              <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleStar(email.id)}
                  className={clsx("p-1.5 rounded-md hover:bg-white/5 transition-colors", email.isStarred ? "text-yellow-400" : "")}
                >
                  <iconify-icon icon={email.isStarred ? "solar:star-bold" : "solar:star-linear"} style={{ fontSize: '18px' }} />
                </button>
                <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors">
                  <iconify-icon icon="solar:reply-linear" style={{ fontSize: '18px' }} />
                </button>
                <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors">
                  <iconify-icon icon="solar:menu-dots-vertical-linear" style={{ fontSize: '18px' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Body content */}
          <div className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {email.body}
          </div>

          {/* Reply Box (Fake) */}
          <div className="mt-12 p-4 border border-white/[0.08] rounded-xl bg-neutral-900/30 flex gap-4 text-neutral-500 text-sm cursor-text hover:bg-neutral-900/50 hover:border-white/20 transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-medium flex-shrink-0">JD</div>
            <div className="flex-1 pt-1.5">Reply to {email.sender}...</div>
          </div>

        </div>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  icon: string;
  tooltip: string;
  onClick?: () => void;
}

function ToolbarButton({ icon, tooltip, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all duration-200 active:scale-95"
    >
      <iconify-icon icon={icon} style={{ fontSize: '18px' }} />
    </button>
  );
}
