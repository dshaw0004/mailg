import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMail } from '../context/MailContext';
import clsx from 'clsx';
import { formatDate } from '../utils/helpers';
import { RotateCw, MoreHorizontal, Inbox, Star, MailOpen, Trash2 } from 'lucide-react';

export default function Mailbox() {
  const { folder } = useParams();
  const navigate = useNavigate();
  const { emails, searchQuery, toggleStar, toggleRead, deleteEmail } = useMail();

  const currentFolder = folder || 'inbox';

  const filteredEmails = useMemo(() => {
    let filtered = emails;

    // Filter by folder
    if (currentFolder === 'starred') {
      filtered = filtered.filter(e => e.isStarred && e.folder !== 'trash');
    } else {
      filtered = filtered.filter(e => e.folder === currentFolder);
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.subject.toLowerCase().includes(q) ||
        e.sender.toLowerCase().includes(q) ||
        e.snippet.toLowerCase().includes(q)
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [emails, currentFolder, searchQuery]);

  const folderTitles: Record<string, string> = {
    inbox: 'Inbox',
    starred: 'Starred',
    sent: 'Sent',
    drafts: 'Drafts',
    trash: 'Trash'
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Mailbox Toolbar */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.04]">
        <h1 className="text-xl font-medium tracking-tight text-white capitalize flex items-center gap-2">
          {folderTitles[currentFolder] || 'Mail'}
          <span className="text-sm font-normal text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full">
            {filteredEmails.length}
          </span>
        </h1>

        <div className="flex items-center gap-2">
          <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
            <RotateCw size={18} />
          </button>
          <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-4">
            <Inbox size={48} className="opacity-20" />
            <p>Nothing to see here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => navigate(`/mail/${email.id}`)}
                className={clsx(
                  "group flex items-center gap-4 px-6 py-3 cursor-pointer transition-all duration-200 border-l-2",
                  email.isRead
                    ? "bg-transparent border-transparent hover:bg-white/[0.02]"
                    : "bg-white/[0.03] border-blue-500 hover:bg-white/[0.06]"
                )}
              >
                {/* Checkbox (Custom styled) */}
                <div
                  className="w-4 h-4 rounded border border-white/20 group-hover:border-white/40 flex items-center justify-center transition-colors cursor-pointer opacity-50 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); /* stub */ }}
                ></div>

                {/* Star Action */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStar(email.id); }}
                  className={clsx(
                    "p-1 transition-transform hover:scale-110 active:scale-95",
                    email.isStarred ? "text-yellow-400" : "text-neutral-500 hover:text-neutral-300 opacity-50 group-hover:opacity-100"
                  )}
                >
                  <Star
                    size={18}
                    fill={email.isStarred ? "currentColor" : "none"}
                  />
                </button>

                {/* Sender */}
                <div className={clsx(
                  "w-48 truncate text-sm transition-colors",
                  email.isRead ? "text-neutral-400" : "text-neutral-200 font-medium"
                )}>
                  {email.sender}
                </div>

                {/* Subject & Snippet */}
                <div className="flex-1 flex items-center min-w-0 pr-4">
                  <div className="truncate text-sm flex items-baseline gap-2">
                    <span className={clsx(
                      "transition-colors",
                      email.isRead ? "text-neutral-300" : "text-white font-medium"
                    )}>
                      {email.subject}
                    </span>
                    <span className="text-neutral-500 truncate">- {email.snippet}</span>
                  </div>
                </div>

                {/* Right side (Date / Hover Actions) */}
                <div className="relative w-24 flex justify-end flex-shrink-0">
                  {/* Date (visible normally) */}
                  <div className={clsx(
                    "text-xs absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2",
                    email.isRead ? "text-neutral-500" : "text-neutral-300 font-medium"
                  )}>
                    {formatDate(email.date)}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ActionButton
                      icon={email.isRead ? MailOpen : MailOpen}
                      tooltip={email.isRead ? "Mark unread" : "Mark read"}
                      onClick={(e) => { e.stopPropagation(); toggleRead(email.id); }}
                    />
                    {currentFolder !== 'trash' && (
                      <ActionButton
                        icon={Trash2}
                        tooltip="Delete"
                        onClick={(e) => { e.stopPropagation(); deleteEmail(email.id); navigate(`/${currentFolder}`); }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ComponentType<{ size: number }>;
  tooltip: string;
  onClick?: (e: React.MouseEvent) => void;
}

function ActionButton({ icon: Icon, tooltip, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-all duration-200 shadow-lg border border-white/5 hover:border-white/10 active:scale-90"
    >
      <Icon size={16} />
    </button>
  );
}
