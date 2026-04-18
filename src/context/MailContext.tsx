"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { parseSenderInfo, generateSnippet } from "@/utils/mailHelpers";
// import { generateMockEmails, type Email } from '../data/mockData';

export interface EmailItem {
  id: string; // This will be message_id from API
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string;
  isRead: boolean;
  isStarred?: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'starred';
  labels: string[];
  attachmentCount: number;
}

export interface Attachment {
  id: string;
  r2_key: string;
  filename: string;
  content_type: string;
  size: number;
}

export interface EmailDetail {
  id: string; // This will be message_id from API
  sender: string;
  senderEmail: string;
  subject: string;
  body: string; // This will be body_html or body_plain
  date: string;
  isRead: boolean;
  isStarred?: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'starred';
  labels: string[];
  attachments: Attachment[];
}

interface ComposeState {
  isOpen: boolean;
  isMinimized: boolean;
}

interface MailContextType {
  emails: EmailItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  composeState: ComposeState;
  fetchEmails: () => Promise<void>;
  fetchEmailById: (id: string) => Promise<EmailDetail | undefined>;
  toggleRead: (id: string) => void;
  toggleStar: (id: string) => void;
  moveFolder: (id: string, folder: EmailItem['folder']) => void;
  deleteEmail: (id: string) => void;
  openCompose: () => void;
  closeCompose: () => void;
  toggleMinimizeCompose: () => void;
  getUnreadCount: (folder: EmailItem['folder']) => number;
}

const MailContext = createContext<MailContextType | undefined>(undefined);

export function MailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [composeState, setComposeState] = useState<ComposeState>({ isOpen: false, isMinimized: false });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmails = useCallback(async () => {
    try {
      const response = await fetch('/api/emails');
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        setEmails([]);
        return;
      }
      interface ApiEmailItem {
        id: string;
        message_id: string;
        from: string;
        to: string;
        subject: string;
        date: string;
        timestamp: number;
        body_plain: string;
        attachment_count: number;
      }
      const data = await response.json();
      const emailsArray = Array.isArray(data) ? data : ((data as any)?.results || []);

      const fetchedEmails: EmailItem[] = emailsArray.map((email: ApiEmailItem) => {
        const { sender, senderEmail } = parseSenderInfo(email.from || '');
        return {
          id: email.message_id,
          sender,
          senderEmail,
          subject: email.subject || 'No Subject',
          snippet: generateSnippet(email.body_plain || ''),
          date: email.date || new Date(email.timestamp * 1000).toISOString(),
          isRead: false,
          isStarred: false,
          folder: 'inbox',
          labels: [],
          attachmentCount: email.attachment_count || 0,
        };
      });
      setEmails(fetchedEmails);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
      setEmails([]);
    }
  }, []);

  const fetchEmailById = useCallback(async (id: string): Promise<EmailDetail | undefined> => {
    try {
      const response = await fetch(`/api/emails/${encodeURIComponent(id)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      interface ApiEmailDetailResponse {
        email: {
          message_id: string;
          from: string;
          to: string;
          subject: string;
          sender: string;
          recipient: string;
          body_plain: string;
          body_html: string;
          date: string;
          timestamp: number;
        };
        attachments: {
          id: string;
          r2_key: string;
          filename: string;
          content_type: string;
          size: number;
        }[];
      }
      const { email: apiEmail, attachments: apiAttachments }: ApiEmailDetailResponse = await response.json();

      const { sender, senderEmail } = parseSenderInfo(apiEmail.from);

      return {
        id: apiEmail.message_id,
        sender,
        senderEmail,
        subject: apiEmail.subject || 'No Subject',
        body: apiEmail.body_html || apiEmail.body_plain || '', // Prefer HTML body
        date: apiEmail.date || new Date(apiEmail.timestamp * 1000).toISOString(),
        isRead: true, // Mark as read when viewing detail
        isStarred: false, // Default
        folder: 'inbox', // Default
        labels: [], // Default
        attachments: apiAttachments.map((att: Attachment) => ({
          id: att.id,
          r2_key: att.r2_key,
          filename: att.filename,
          content_type: att.content_type,
          size: att.size,
        })),
      };
    } catch (error) {
      console.error(`Failed to fetch email with ID ${id}:`, error);
      return undefined;
    }
  }, []);

  useEffect(() => {
    const loadEmails = async () => {
      await fetchEmails();
    };
    loadEmails();
  }, [fetchEmails]);

  const toggleRead = (id: string) => {
    setEmails(prevEmails => prevEmails.map(email =>
      email.id === id ? { ...email, isRead: !email.isRead } : email
    ));
  };

  const toggleStar = (id: string) => {
    setEmails(prevEmails => prevEmails.map(email =>
      email.id === id ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const moveFolder = (id: string, folder: EmailItem['folder']) => {
    setEmails(prevEmails => prevEmails.map(email =>
      email.id === id ? { ...email, folder } : email
    ));
  };

  const deleteEmail = (id: string) => {
    setEmails(prevEmails => prevEmails.map(email =>
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

  const getUnreadCount = (folder: EmailItem['folder']) => {
    return emails.filter(e => e.folder === folder && !e.isRead).length;
  };

  return (
    <MailContext.Provider value={{
      emails,
      searchQuery,
      setSearchQuery,
      composeState,
      fetchEmails,
      fetchEmailById,
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
