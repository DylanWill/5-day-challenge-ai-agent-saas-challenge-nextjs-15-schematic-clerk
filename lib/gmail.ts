import { google } from 'googleapis';
import { getAuthenticatedClient } from './googleAuth';

// Create Gmail service
export async function getGmailService() {
  const auth = await getAuthenticatedClient();
  
  if (!auth) {
    throw new Error('Not authenticated with Google');
  }
  
  return google.gmail({ version: 'v1', auth });
}

// Get user profile
export async function getUserProfile() {
  try {
    const gmail = await getGmailService();
    const response = await gmail.users.getProfile({ userId: 'me' });
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

// List emails from inbox
export async function listEmails(maxResults = 20, query = '') {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: query,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error listing emails:', error);
    throw error;
  }
}

// Get email details
export async function getEmail(id: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.get({
      userId: 'me',
      id,
      format: 'full',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting email:', error);
    throw error;
  }
}

// Send email
export async function sendEmail(to: string, subject: string, body: string, attachments: any[] = []) {
  try {
    const gmail = await getGmailService();
    
    // Create email content
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body,
    ];
    
    const email = emailLines.join('\r\n').trim();
    
    // Encode the email
    const encodedEmail = Buffer.from(email).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Send the email
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Create draft email
export async function createDraft(to: string, subject: string, body: string, attachments: any[] = []) {
  try {
    const gmail = await getGmailService();
    
    // Create email content
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body,
    ];
    
    const email = emailLines.join('\r\n').trim();
    
    // Encode the email
    const encodedEmail = Buffer.from(email).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Create the draft
    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedEmail,
        },
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating draft:', error);
    throw error;
  }
}

// Get email labels
export async function getLabels() {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.labels.list({
      userId: 'me',
    });
    
    return response.data.labels || [];
  } catch (error) {
    console.error('Error getting labels:', error);
    throw error;
  }
}

// Create a new label
export async function createLabel(name: string, labelListVisibility = 'labelShow', messageListVisibility = 'show') {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name,
        labelListVisibility,
        messageListVisibility,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating label:', error);
    throw error;
  }
}

// Add label to email
export async function addLabelToEmail(emailId: string, labelId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        addLabelIds: [labelId],
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error adding label to email:', error);
    throw error;
  }
}

// Remove label from email
export async function removeLabelFromEmail(emailId: string, labelId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        removeLabelIds: [labelId],
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error removing label from email:', error);
    throw error;
  }
}

// Mark email as read
export async function markAsRead(emailId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        removeLabelIds: ['UNREAD'],
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error marking email as read:', error);
    throw error;
  }
}

// Mark email as unread
export async function markAsUnread(emailId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        addLabelIds: ['UNREAD'],
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error marking email as unread:', error);
    throw error;
  }
}

// Star an email
export async function starEmail(emailId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        addLabelIds: ['STARRED'],
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error starring email:', error);
    throw error;
  }
}

// Unstar an email
export async function unstarEmail(emailId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        removeLabelIds: ['STARRED'],
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error unstarring email:', error);
    throw error;
  }
}

// Archive an email (remove from inbox)
export async function archiveEmail(emailId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        removeLabelIds: ['INBOX'],
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error archiving email:', error);
    throw error;
  }
}

// Move email to trash
export async function trashEmail(emailId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.trash({
      userId: 'me',
      id: emailId,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error trashing email:', error);
    throw error;
  }
}

// Restore email from trash
export async function untrashEmail(emailId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.untrash({
      userId: 'me',
      id: emailId,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error untrashing email:', error);
    throw error;
  }
}

// Get email thread
export async function getThread(threadId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting email thread:', error);
    throw error;
  }
}

// List email threads
export async function listThreads(maxResults = 20, query = '') {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.threads.list({
      userId: 'me',
      maxResults,
      q: query,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error listing email threads:', error);
    throw error;
  }
}

// Get attachment
export async function getAttachment(messageId: string, attachmentId: string) {
  try {
    const gmail = await getGmailService();
    
    const response = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId,
      id: attachmentId,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting attachment:', error);
    throw error;
  }
}

// Parse email
export function parseEmail(message: any) {
  const headers = message.payload.headers;
  
  // Extract common headers
  const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
  const from = headers.find((h: any) => h.name === 'From')?.value || '';
  const to = headers.find((h: any) => h.name === 'To')?.value || '';
  const date = headers.find((h: any) => h.name === 'Date')?.value || '';
  
  // Extract body
  let body = '';
  let attachments: any[] = [];
  
  function processMessagePart(part: any) {
    if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
      if (part.body.data) {
        const decodedBody = Buffer.from(part.body.data, 'base64').toString('utf8');
        if (part.mimeType === 'text/html') {
          body = decodedBody; // Prefer HTML
        } else if (!body) {
          body = decodedBody; // Use plain text if HTML not available
        }
      }
    } else if (part.mimeType.startsWith('image/') || 
              part.mimeType.startsWith('application/') || 
              part.mimeType.startsWith('audio/') || 
              part.mimeType.startsWith('video/')) {
      // This is an attachment
      if (part.body.attachmentId) {
        attachments.push({
          id: part.body.attachmentId,
          filename: part.filename,
          mimeType: part.mimeType,
          size: part.body.size,
        });
      }
    }
    
    // Process nested parts recursively
    if (part.parts) {
      part.parts.forEach(processMessagePart);
    }
  }
  
  // Process the message parts
  if (message.payload.parts) {
    message.payload.parts.forEach(processMessagePart);
  } else if (message.payload.body && message.payload.body.data) {
    // Simple message
    body = Buffer.from(message.payload.body.data, 'base64').toString('utf8');
  }
  
  return {
    id: message.id,
    threadId: message.threadId,
    labelIds: message.labelIds || [],
    snippet: message.snippet,
    subject,
    from,
    to,
    date,
    body,
    attachments,
    isUnread: message.labelIds?.includes('UNREAD') || false,
    isStarred: message.labelIds?.includes('STARRED') || false,
    isInbox: message.labelIds?.includes('INBOX') || false,
  };
}

// Search emails
export async function searchEmails(query: string, maxResults = 20) {
  return listEmails(maxResults, query);
}

// Get emails by label
export async function getEmailsByLabel(labelId: string, maxResults = 20) {
  return listEmails(maxResults, `label:${labelId}`);
}

// Reply to email
export async function replyToEmail(originalMessageId: string, body: string, attachments: any[] = []) {
  try {
    // Get the original message to extract headers
    const originalMessage = await getEmail(originalMessageId);
    const parsedEmail = parseEmail(originalMessage);
    
    // Extract the recipient from the 'From' header of the original message
    const to = parsedEmail.from;
    
    // Create subject with Re: prefix if not already present
    let subject = parsedEmail.subject;
    if (!subject.toLowerCase().startsWith('re:')) {
      subject = `Re: ${subject}`;
    }
    
    // Create email content with proper threading headers
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `References: ${originalMessage.id}`,
      `In-Reply-To: ${originalMessage.id}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body,
    ];
    
    const email = emailLines.join('\r\n').trim();
    
    // Encode the email
    const encodedEmail = Buffer.from(email).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Send the reply
    const gmail = await getGmailService();
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
        threadId: parsedEmail.threadId,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error replying to email:', error);
    throw error;
  }
}

// Forward email
export async function forwardEmail(originalMessageId: string, to: string, additionalBody = '', attachments: any[] = []) {
  try {
    // Get the original message
    const originalMessage = await getEmail(originalMessageId);
    const parsedEmail = parseEmail(originalMessage);
    
    // Create subject with Fwd: prefix if not already present
    let subject = parsedEmail.subject;
    if (!subject.toLowerCase().startsWith('fwd:')) {
      subject = `Fwd: ${subject}`;
    }
    
    // Create forwarded message content
    const forwardedContent = `
      <div>
        ${additionalBody}
        <br><br>
        ---------- Forwarded message ---------<br>
        From: ${parsedEmail.from}<br>
        Date: ${parsedEmail.date}<br>
        Subject: ${parsedEmail.subject}<br>
        To: ${parsedEmail.to}<br>
        <br>
        ${parsedEmail.body}
      </div>
    `;
    
    // Create email content
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      forwardedContent,
    ];
    
    const email = emailLines.join('\r\n').trim();
    
    // Encode the email
    const encodedEmail = Buffer.from(email).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Send the forwarded email
    const gmail = await getGmailService();
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error forwarding email:', error);
    throw error;
  }
} 