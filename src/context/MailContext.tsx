import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { generateMockEmails, type Email } from '../data/mockData';

interface ComposeState {
  isOpen: boolean;
  isMinimized: boolean;
}

interface MailContextType {
  emails: Email[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  composeState: ComposeState;
  toggleRead: (id: string) => void;
  toggleStar: (id: string) => void;
  moveFolder: (id: string, folder: Email['folder']) => void;
  deleteEmail: (id: string) => void;
  openCompose: () => void;
  closeCompose: () => void;
  toggleMinimizeCompose: () => void;
  getUnreadCount: (folder: string) => number;
}

const MailContext = createContext<MailContextType | undefined>(undefined);

export function MailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [composeState, setComposeState] = useState<ComposeState>({ isOpen: false, isMinimized: false });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setEmails(generateMockEmails());
  }, []);

  const toggleRead = (id: string) => {
    setEmails(emails.map(email =>
      email.id === id ? { ...email, isRead: !email.isRead } : email
    ));
  };

  const toggleStar = (id: string) => {
    setEmails(emails.map(email =>
      email.id === id ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const moveFolder = (id: string, folder: Email['folder']) => {
    setEmails(emails.map(email =>
      email.id === id ? { ...email, folder } : email
    ));
  };

  const deleteEmail = (id: string) => {
    setEmails(emails.map(email =>
      email.id === id ? { ...email, folder: 'trash' } : email
    ));
  };

  const openCompose = () => {
    setComposeState({ isOpen: true, isMinimized: false });
  };

  const closeCompose = () => {
    setComposeState({ isOpen: false, isMinimized: false });
  };

  const toggleMinimizeCompose = () => {
    setComposeState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const getUnreadCount = (folder: string) => {
    return emails.filter(e => e.folder === folder && !e.isRead).length;
  };

  return (
    <MailContext.Provider value={{
      emails,
      searchQuery,
      setSearchQuery,
      composeState,
      toggleRead,
      toggleStar,
      moveFolder,
      deleteEmail,
      openCompose,
      closeCompose,
      toggleMinimizeCompose,
      getUnreadCount
    }}>
      {children}
    </MailContext.Provider>
  );
}

export function useMail() {
  const context = useContext(MailContext);
  if (context === undefined) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
}
