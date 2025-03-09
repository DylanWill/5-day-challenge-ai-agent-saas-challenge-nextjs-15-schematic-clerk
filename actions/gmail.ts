'use server';

import { 
  listEmails, 
  getEmail, 
  parseEmail, 
  sendEmail, 
  createDraft,
  markAsRead,
  markAsUnread,
  starEmail,
  unstarEmail,
  archiveEmail,
  trashEmail,
  untrashEmail,
  getLabels,
  createLabel,
  addLabelToEmail,
  removeLabelFromEmail,
  getThread,
  listThreads,
  getAttachment,
  replyToEmail,
  forwardEmail,
  searchEmails,
  getEmailsByLabel
} from '@/lib/gmail';
import { isGoogleAuthenticated } from '@/lib/googleAuth';

// Fetch emails from Gmail
export async function fetchEmails(maxResults = 20, query = '') {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
        emails: [],
      };
    }
    
    // Check for mock mode
    if (process.env.USE_MOCK_GOOGLE_AUTH === 'true') {
      console.log('Using mock email data');
      
      // Generate mock email data
      const mockEmails = Array.from({ length: 15 }, (_, i) => ({
        id: `mock-email-${i}`,
        threadId: `mock-thread-${i}`,
        labelIds: i % 3 === 0 ? ['UNREAD', 'INBOX'] : ['INBOX'],
        snippet: `This is a mock email snippet ${i}...`,
        historyId: '12345',
        internalDate: new Date(Date.now() - i * 86400000).getTime().toString(),
        payload: {
          mimeType: 'text/html',
          headers: [
            { name: 'From', value: `sender${i}@example.com` },
            { name: 'To', value: 'you@example.com' },
            { name: 'Subject', value: `Mock Email Subject ${i}` },
            { name: 'Date', value: new Date(Date.now() - i * 86400000).toISOString() }
          ]
        },
        sizeEstimate: 1024,
        raw: '',
        // Parsed fields
        from: `Sender Name ${i} <sender${i}@example.com>`,
        to: 'Your Name <you@example.com>',
        subject: `Mock Email Subject ${i}`,
        date: new Date(Date.now() - i * 86400000).toISOString(),
        body: `<p>This is the body of mock email ${i}.</p><p>It contains some sample content for testing.</p>`,
        attachments: []
      }));
      
      return {
        success: true,
        emails: mockEmails,
      };
    }
    
    // Real implementation for production
    // Fetch emails from Gmail
    const response = await listEmails(maxResults, query);
    
    if (!response.messages || response.messages.length === 0) {
      return {
        success: true,
        emails: [],
      };
    }
    
    // Fetch details for each email
    const emailPromises = response.messages.slice(0, maxResults).map(async (message: any) => {
      const emailData = await getEmail(message.id);
      return parseEmail(emailData);
    });
    
    const emails = await Promise.all(emailPromises);
    
    return {
      success: true,
      emails,
    };
  } catch (error) {
    console.error('Error fetching emails:', error);
    return {
      success: false,
      error: 'Failed to fetch emails',
      emails: [],
    };
  }
}

// Send email
export async function sendGmailEmail(to: string, subject: string, body: string, attachments: any[] = []) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Send email
    const response = await sendEmail(to, subject, body, attachments);
    
    return {
      success: true,
      messageId: response.id,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: 'Failed to send email',
    };
  }
}

// Create draft email
export async function createGmailDraft(to: string, subject: string, body: string, attachments: any[] = []) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Create draft
    const response = await createDraft(to, subject, body, attachments);
    
    return {
      success: true,
      draftId: response.id,
    };
  } catch (error) {
    console.error('Error creating draft:', error);
    return {
      success: false,
      error: 'Failed to create draft',
    };
  }
}

// Get email labels
export async function fetchLabels() {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
        labels: [],
      };
    }
    
    // Get labels
    const labels = await getLabels();
    
    return {
      success: true,
      labels,
    };
  } catch (error) {
    console.error('Error fetching labels:', error);
    return {
      success: false,
      error: 'Failed to fetch labels',
      labels: [],
    };
  }
}

// Create a new label
export async function createGmailLabel(name: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Create label
    const response = await createLabel(name);
    
    return {
      success: true,
      label: response,
    };
  } catch (error) {
    console.error('Error creating label:', error);
    return {
      success: false,
      error: 'Failed to create label',
    };
  }
}

// Mark email as read
export async function markEmailAsRead(emailId: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Mark as read
    await markAsRead(emailId);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error marking email as read:', error);
    return {
      success: false,
      error: 'Failed to mark email as read',
    };
  }
}

// Mark email as unread
export async function markEmailAsUnread(emailId: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Mark as unread
    await markAsUnread(emailId);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error marking email as unread:', error);
    return {
      success: false,
      error: 'Failed to mark email as unread',
    };
  }
}

// Star email
export async function starGmailEmail(emailId: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Star email
    await starEmail(emailId);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error starring email:', error);
    return {
      success: false,
      error: 'Failed to star email',
    };
  }
}

// Unstar email
export async function unstarGmailEmail(emailId: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Unstar email
    await unstarEmail(emailId);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error unstarring email:', error);
    return {
      success: false,
      error: 'Failed to unstar email',
    };
  }
}

// Archive email
export async function archiveGmailEmail(emailId: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Archive email
    await archiveEmail(emailId);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error archiving email:', error);
    return {
      success: false,
      error: 'Failed to archive email',
    };
  }
}

// Trash email
export async function trashGmailEmail(emailId: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Trash email
    await trashEmail(emailId);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error trashing email:', error);
    return {
      success: false,
      error: 'Failed to trash email',
    };
  }
}

// Untrash email
export async function untrashGmailEmail(emailId: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Untrash email
    await untrashEmail(emailId);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error untrashing email:', error);
    return {
      success: false,
      error: 'Failed to untrash email',
    };
  }
}

// Get email thread
export async function fetchEmailThread(threadId: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
        thread: null,
      };
    }
    
    // Get thread
    const thread = await getThread(threadId);
    
    // Parse messages in thread
    const messages = thread.messages?.map(parseEmail) || [];
    
    return {
      success: true,
      thread: {
        id: thread.id,
        historyId: thread.historyId,
        messages,
      },
    };
  } catch (error) {
    console.error('Error fetching email thread:', error);
    return {
      success: false,
      error: 'Failed to fetch email thread',
      thread: null,
    };
  }
}

// Reply to email
export async function replyToGmailEmail(originalMessageId: string, body: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Reply to email
    const response = await replyToEmail(originalMessageId, body);
    
    return {
      success: true,
      messageId: response.id,
    };
  } catch (error) {
    console.error('Error replying to email:', error);
    return {
      success: false,
      error: 'Failed to reply to email',
    };
  }
}

// Forward email
export async function forwardGmailEmail(originalMessageId: string, to: string, additionalBody = '') {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
      };
    }
    
    // Forward email
    const response = await forwardEmail(originalMessageId, to, additionalBody);
    
    return {
      success: true,
      messageId: response.id,
    };
  } catch (error) {
    console.error('Error forwarding email:', error);
    return {
      success: false,
      error: 'Failed to forward email',
    };
  }
}

// Search emails
export async function searchGmailEmails(query: string, maxResults = 20) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
        emails: [],
      };
    }
    
    // Search emails
    const response = await searchEmails(query, maxResults);
    
    if (!response.messages || response.messages.length === 0) {
      return {
        success: true,
        emails: [],
      };
    }
    
    // Fetch details for each email
    const emailPromises = response.messages.slice(0, maxResults).map(async (message: any) => {
      const emailData = await getEmail(message.id);
      return parseEmail(emailData);
    });
    
    const emails = await Promise.all(emailPromises);
    
    return {
      success: true,
      emails,
    };
  } catch (error) {
    console.error('Error searching emails:', error);
    return {
      success: false,
      error: 'Failed to search emails',
      emails: [],
    };
  }
}

// Get emails by label
export async function fetchEmailsByLabel(labelId: string, maxResults = 20) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
        emails: [],
      };
    }
    
    // Get emails by label
    const response = await getEmailsByLabel(labelId, maxResults);
    
    if (!response.messages || response.messages.length === 0) {
      return {
        success: true,
        emails: [],
      };
    }
    
    // Fetch details for each email
    const emailPromises = response.messages.slice(0, maxResults).map(async (message: any) => {
      const emailData = await getEmail(message.id);
      return parseEmail(emailData);
    });
    
    const emails = await Promise.all(emailPromises);
    
    return {
      success: true,
      emails,
    };
  } catch (error) {
    console.error('Error fetching emails by label:', error);
    return {
      success: false,
      error: 'Failed to fetch emails by label',
      emails: [],
    };
  }
}

// Get attachment
export async function fetchEmailAttachment(messageId: string, attachmentId: string) {
  try {
    // Check if user is authenticated with Google
    if (!isGoogleAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated with Google',
        attachment: null,
      };
    }
    
    // Get attachment
    const attachment = await getAttachment(messageId, attachmentId);
    
    return {
      success: true,
      attachment,
    };
  } catch (error) {
    console.error('Error fetching attachment:', error);
    return {
      success: false,
      error: 'Failed to fetch attachment',
      attachment: null,
    };
  }
} 