import { NavLink, useLocation } from 'react-router-dom';
import { useMail } from '../context/MailContext';
import clsx from 'clsx';

export default function Sidebar() {
  const { openCompose, getUnreadCount } = useMail();
  const location = useLocation();

  const navItems = [
    { icon: 'solar:inbox-linear', iconActive: 'solar:inbox-bold', label: 'Inbox', path: '/inbox', count: getUnreadCount('inbox') },
    { icon: 'solar:star-linear', iconActive: 'solar:star-bold', label: 'Starred', path: '/starred' },
    { icon: 'solar:plain-2-linear', iconActive: 'solar:plain-2-bold', label: 'Sent', path: '/sent' },
    { icon: 'solar:file-text-linear', iconActive: 'solar:file-text-bold', label: 'Drafts', path: '/drafts', count: getUnreadCount('drafts') },
    { icon: 'solar:trash-bin-trash-linear', iconActive: 'solar:trash-bin-trash-bold', label: 'Trash', path: '/trash' },
  ];

  return (
    <div className="w-[260px] flex-shrink-0 flex flex-col h-full bg-neutral-950 px-3 py-4 z-10">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 mb-8 cursor-pointer group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-lg">
          <iconify-icon icon="solar:letter-bold" style={{ fontSize: '20px', color: '#e5e5e5' }} />
        </div>
        <span className="font-medium text-lg tracking-tight text-neutral-100 group-hover:text-white transition-colors">Mailbox</span>
      </div>

      {/* Compose Button */}
      <button
        onClick={openCompose}
        className="mb-8 group relative w-full flex items-center gap-3 px-4 py-3 bg-neutral-100 text-neutral-950 rounded-xl font-medium hover:bg-white transition-all duration-300 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
      >
        <iconify-icon icon="solar:pen-new-square-linear" style={{ fontSize: '20px' }} className="transition-transform group-hover:scale-110 duration-300" />
        <span>Compose</span>
        {/* Subtle glow effect behind button */}
        <div className="absolute inset-0 -z-10 rounded-xl bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative",
                isActive
                  ? "bg-white/10 text-white font-medium"
                  : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
              )}
            >
              <div className="flex items-center gap-3 relative z-10">
                <iconify-icon
                  icon={isActive ? item.iconActive : item.icon}
                  style={{ fontSize: '20px' }}
                  className={clsx(
                    "transition-transform duration-300",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.count! > 0 && (
                <span className={clsx(
                  "text-xs px-1.5 py-0.5 rounded-md min-w-[20px] text-center transition-colors duration-300",
                  isActive ? "bg-white/20 text-white" : "bg-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-neutral-300"
                )}>
                  {item.count}
                </span>
              )}

              {/* Active state subtle indicator line */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-white rounded-r-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile / Settings */}
      <div className="mt-auto pt-4 border-t border-white/[0.08]">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200 transition-all duration-200 group">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-medium shadow-sm group-hover:ring-2 ring-white/20 transition-all">
            JD
          </div>
          <span className="flex-1 text-left line-clamp-1">johndoe@example.com</span>
          <iconify-icon icon="solar:alt-arrow-down-linear" style={{ fontSize: '16px' }} />
        </button>
      </div>
    </div>
  );
}
