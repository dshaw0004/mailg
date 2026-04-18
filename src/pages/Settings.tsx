import { useState } from 'react';
import clsx from 'clsx';
import { Settings as SettingsIcon, User, Palette, Bell, Lock, Camera } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in bg-[#0a0a0a]">
      {/* Settings Header */}
      <div className="px-8 py-6 border-b border-white/[0.04] flex-shrink-0 bg-neutral-900/20">
        <h1 className="text-2xl font-medium tracking-tight text-white flex items-center gap-3">
          <SettingsIcon size={28} className="text-neutral-400" />
          Settings
        </h1>
        <p className="text-neutral-500 text-sm mt-1 ml-[40px]">Manage your account preferences and app configurations.</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-64 border-r border-white/[0.04] p-4 flex flex-col gap-1 overflow-y-auto bg-neutral-900/10">
          <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2 px-3">Preferences</div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left",
                activeTab === tab.id
                  ? "bg-white/10 text-white font-medium shadow-sm ring-1 ring-white/5"
                  : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
              )}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl">
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'security' && <SecuritySettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-lg font-medium text-white mb-4">Profile Information</h2>
        <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-xl flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-2xl text-white font-medium shadow-lg">
              JD
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium text-white">John Doe</h3>
            <p className="text-sm text-neutral-400 mb-3">johndoe@example.com</p>
            <button className="px-4 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              Change Avatar
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-white border-b border-white/[0.04] pb-2">Personal Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" defaultValue="John" />
          <Input label="Last Name" defaultValue="Doe" />
        </div>
        <Input label="Email Address" type="email" defaultValue="johndoe@example.com" />
        <Input label="Job Title" defaultValue="Senior Product Designer" />

        <div className="pt-4 flex justify-end">
          <button className="px-5 py-2 bg-white text-neutral-950 text-sm font-medium rounded-lg hover:bg-neutral-200 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState('dark');

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-lg font-medium text-white mb-4">Interface Theme</h2>
        <div className="grid grid-cols-3 gap-4">
          <ThemeOption
            active={theme === 'light'}
            onClick={() => setTheme('light')}
            label="Light"
            previewClass="bg-neutral-100 border-neutral-300"
          />
          <ThemeOption
            active={theme === 'dark'}
            onClick={() => setTheme('dark')}
            label="Dark"
            previewClass="bg-neutral-900 border-neutral-700"
          />
          <ThemeOption
            active={theme === 'system'}
            onClick={() => setTheme('system')}
            label="System"
            previewClass="bg-gradient-to-r from-neutral-100 to-neutral-900 border-neutral-500"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-white mb-4 border-b border-white/[0.04] pb-2">Layout Density</h2>
        <div className="space-y-2 mt-4 bg-white/[0.02] border border-white/[0.04] rounded-xl p-2">
          <RadioOption label="Comfortable" description="More space between emails" checked={true} />
          <RadioOption label="Compact" description="Fit more emails on screen" checked={false} />
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [toggles, setToggles] = useState({
    push: true,
    email: false,
    mentions: true,
    marketing: false
  });

  const updateToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-lg font-medium text-white mb-4">Email Notifications</h2>
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2">
          <Toggle
            label="Push Notifications"
            description="Receive push notifications when a new email arrives"
            enabled={toggles.push}
            onChange={() => updateToggle('push')}
          />
          <Toggle
            label="Daily Digest"
            description="Get a daily summary of missed notifications via email"
            enabled={toggles.email}
            onChange={() => updateToggle('email')}
          />
          <Toggle
            label="Mentions Only"
            description="Only notify me when I am directly mentioned or replied to"
            enabled={toggles.mentions}
            onChange={() => updateToggle('mentions')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-white mb-4">Other Updates</h2>
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2">
          <Toggle
            label="Marketing & Announcements"
            description="Receive emails about new features and product updates"
            enabled={toggles.marketing}
            onChange={() => updateToggle('marketing')}
          />
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-lg font-medium text-white mb-4">Password</h2>
        <div className="space-y-4">
          <Input label="Current Password" type="password" defaultValue="••••••••" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
          </div>
          <button className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 active:scale-95 transition-all">
            Update Password
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-red-400 mb-4 border-b border-red-500/10 pb-2">Danger Zone</h2>
        <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white">Delete Account</h3>
            <p className="text-xs text-neutral-400 mt-1">Permanently delete your account and all associated data.</p>
          </div>
          <button className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 hover:text-red-300 active:scale-95 transition-all border border-red-500/20">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable UI Components

interface InputProps {
  label: string;
  type?: string;
  defaultValue?: string;
}

function Input({ label, type = "text", defaultValue }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm text-neutral-400 font-medium">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full bg-neutral-900 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.06] focus:border-white/20 transition-all shadow-inner"
      />
    </div>
  );
}

interface ThemeOptionProps {
  label: string;
  previewClass: string;
  active: boolean;
  onClick: () => void;
}

function ThemeOption({ label, previewClass, active, onClick }: ThemeOptionProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 text-left items-start active:scale-95",
        active ? "bg-white/10 border-white/20 shadow-md" : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04] hover:border-white/10"
      )}
    >
      <div className={clsx("w-full h-16 rounded-md border shadow-sm", previewClass)}></div>
      <div className="flex items-center gap-2">
        <div className={clsx(
          "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
          active ? "border-blue-500 bg-blue-500" : "border-neutral-600"
        )}>
          {active && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
        </div>
        <span className="text-sm font-medium text-neutral-200">{label}</span>
      </div>
    </button>
  );
}

interface RadioOptionProps {
  label: string;
  description: string;
  checked: boolean;
}

function RadioOption({ label, description, checked }: RadioOptionProps) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer group">
      <div className={clsx(
        "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors flex-shrink-0",
        checked ? "border-blue-500 bg-blue-500" : "border-neutral-600 group-hover:border-neutral-400"
      )}>
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
      </div>
      <div>
        <div className="text-sm font-medium text-neutral-200">{label}</div>
        <div className="text-xs text-neutral-500 mt-0.5">{description}</div>
      </div>
    </label>
  );
}

interface ToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}

function Toggle({ label, description, enabled, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
      <div className="pr-4">
        <h3 className="text-sm font-medium text-neutral-200">{label}</h3>
        <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={clsx(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          enabled ? "bg-blue-500" : "bg-neutral-700"
        )}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            enabled ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
