// src/utils/mailHelpers.ts

// Helper to parse "Sender Name <email@example.com>"
export const parseSenderInfo = (from: string) => {
  const match = from.match(/(.*)<(.*)>/);
  if (match) {
    return {
      sender: match[1].trim(),
      senderEmail: match[2].trim(),
    };
  }
  return { sender: from, senderEmail: from };
};

// Helper to generate a snippet from body_plain
export const generateSnippet = (body: string) => {
  const MAX_SNIPPET_LENGTH = 100;
  return body.length > MAX_SNIPPET_LENGTH ? body.substring(0, MAX_SNIPPET_LENGTH) + '...' : body;
};
