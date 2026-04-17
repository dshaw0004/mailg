export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred?: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'starred';
  labels: string[];
}

export const generateMockEmails = (): Email[] => {
  const now = new Date();

  return [
    {
      id: 'msg-001',
      sender: 'Vercel',
      senderEmail: 'notifications@vercel.com',
      subject: 'Deployment successful for project "frontend-rewrite"',
      snippet: 'Your project frontend-rewrite has been successfully deployed. View the latest changes at the production URL.',
      body: `Your project frontend-rewrite has been successfully deployed.

Branch: main
Commit: "Refactor mail architecture"
Environment: Production

View the deployment here: https://frontend-rewrite.vercel.app`,
      date: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
      isRead: false,
      folder: 'inbox',
      labels: ['Updates']
    },
    {
      id: 'msg-002',
      sender: 'Stripe',
      senderEmail: 'receipts@stripe.com',
      subject: 'Your receipt from Linear',
      snippet: 'Receipt #1234-5678. You paid $8.00 to Linear. Download your PDF receipt here.',
      body: `Here is your receipt for your recent payment to Linear.

Amount: $8.00
Date: ${now.toLocaleDateString()}
Card: Visa ending in 4242

If you have any questions, please contact support.`,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: true,
      isStarred: true,
      folder: 'inbox',
      labels: ['Receipts']
    },
    {
      id: 'msg-003',
      sender: 'Sarah Jenkins',
      senderEmail: 'sarah.j@example.com',
      subject: 'Q3 Design Review Meeting Notes',
      snippet: 'Hey team, attaching the notes from our design sync today. Let me know if I missed anything regarding the new micro-interactions.',
      body: `Hey team,

Great sync today! Here are the key takeaways regarding the new UI update:
- We're moving towards darker, lower-contrast borders (white/10).
- Hover states should feel instantaneous but smooth (200ms ease-out).
- Drop shadow usage should be minimal, relying more on border highlights.

Let's sync again next Tuesday.

Best,
Sarah`,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      isRead: false,
      folder: 'inbox',
      labels: ['Work']
    },
    {
      id: 'msg-004',
      sender: 'GitHub',
      senderEmail: 'noreply@github.com',
      subject: '[react-mail-clone] Pull request opened by @alexdev',
      snippet: 'AlexDev wants to merge 3 commits into main from feature/animations.',
      body: `AlexDev has opened a new pull request: Feature/animations.

- Added smooth scale transitions to sidebar buttons
- Implemented floating compose window with minimize state
- Fixed scrollbar styling for dark mode

Review the changes here: https://github.com/example/repo/pull/42`,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      isRead: true,
      folder: 'inbox',
      labels: ['Updates']
    },
    {
      id: 'msg-005',
      sender: 'Me',
      senderEmail: 'me@example.com',
      subject: 'Draft: Thoughts on the new architecture',
      snippet: 'I think we should move towards a more event-driven approach for the state management...',
      body: `I think we should move towards a more event-driven approach for the state management. 
Currently, prop drilling is becoming an issue. Maybe we should look into Context or a lightweight store.`,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(),
      isRead: true,
      folder: 'drafts',
      labels: []
    },
    {
      id: 'msg-006',
      sender: 'Figma',
      senderEmail: 'notifications@figma.com',
      subject: 'David commented on "Mail App Redesign"',
      snippet: 'David: "Can we make this text slightly darker? The contrast is a bit too high for dark mode."',
      body: `David left a comment on your file "Mail App Redesign".

"Can we make this text slightly darker? The contrast is a bit too high for dark mode. Try text-neutral-400 instead of text-neutral-200 for secondary text."

Reply in Figma: [Link]`,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 96).toISOString(),
      isRead: true,
      folder: 'inbox',
      labels: ['Design']
    },
    {
      id: 'msg-007',
      sender: 'Me',
      senderEmail: 'me@example.com',
      subject: 'Invoice for March UI Design Work',
      snippet: 'Please find attached my invoice for the UI design consulting work completed in March.',
      body: `Hi Team,

Please find attached my invoice for the UI design consulting work completed in March. 
Total hours: 45
Rate: $120/hr
Total: $5,400

Let me know if you need anything else to process this.

Thanks!`,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 120).toISOString(),
      isRead: true,
      folder: 'sent',
      labels: []
    }
  ];
};
