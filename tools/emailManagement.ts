import { z } from "zod";
import { tool } from "ai";

// Function to draft an email using MailerSend
async function draftEmail(
  recipient: string,
  recipientEmail: string,
  subject: string,
  purpose: string,
  propertyAddress?: string,
  additionalDetails?: string,
  senderName: string = "Real Estate Agent"
) {
  // Construct email body based on purpose and details
  let body = `Dear ${recipient},\n\n`;
  
  if (purpose === "listing") {
    body += `I'm writing regarding the listing of your property${propertyAddress ? ` at ${propertyAddress}` : ''}. `;
    body += `I'd like to discuss the listing details and marketing strategy for your property.`;
  } else if (purpose === "showing") {
    body += `I'm writing to confirm our showing appointment${propertyAddress ? ` for the property at ${propertyAddress}` : ''}. `;
    body += `Please let me know if the scheduled time works for you.`;
  } else if (purpose === "offer") {
    body += `I'm pleased to inform you that we've received an offer${propertyAddress ? ` for your property at ${propertyAddress}` : ''}. `;
    body += `I'd like to schedule a time to review the details with you.`;
  } else if (purpose === "closing") {
    body += `I'm writing regarding the closing process${propertyAddress ? ` for the property at ${propertyAddress}` : ''}. `;
    body += `Here are the next steps we need to take to complete the transaction.`;
  } else {
    body += `I'm writing regarding your real estate needs${propertyAddress ? ` related to the property at ${propertyAddress}` : ''}. `;
  }
  
  if (additionalDetails) {
    body += `\n\n${additionalDetails}`;
  }
  
  body += `\n\nPlease don't hesitate to contact me if you have any questions or need further information.`;
  body += `\n\nBest regards,\n${senderName}`;
  
  // In a real implementation, this would use MailerSend API to save as a draft
  // For now, we'll just return the draft content
  console.log(`Drafting email to ${recipientEmail} using MailerSend`);
  
  return {
    to: recipientEmail,
    subject,
    body,
    draftId: "draft_" + Date.now(),
    timestamp: new Date().toISOString(),
  };
}

// Function to send an email using MailerSend
async function sendEmail(
  to: string,
  subject: string,
  body: string,
  from: string = process.env.MAILERSEND_FROM_EMAIL || "noreply@example.com",
  fromName: string = process.env.MAILERSEND_FROM_NAME || "Real Estate Agent"
) {
  try {
    // In a real implementation, this would use the MailerSend API
    // Example implementation with MailerSend SDK:
    /*
    const MailerSend = require("mailersend");
    
    const mailersend = new MailerSend({
      api_key: process.env.MAILERSEND_API_KEY,
    });
    
    const emailParams = {
      from: {
        email: from,
        name: fromName,
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      text: body,
    };
    
    const response = await mailersend.send(emailParams);
    return {
      sent: true,
      messageId: response.message_id,
      timestamp: new Date().toISOString(),
    };
    */
    
    // Mock response for now
    console.log(`Sending email to ${to} using MailerSend`);
    return {
      sent: true,
      messageId: "mailersend_" + Date.now(),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error sending email with MailerSend:", error);
    throw new Error("Failed to send email. Please try again or contact support.");
  }
}

// Function to categorize an email
async function categorizeEmail(subject: string, body: string) {
  // In a real implementation, this would use NLP to categorize the email
  console.log(`Categorizing email: ${subject}`);
  
  // Simple keyword-based categorization
  const subjectLower = subject.toLowerCase();
  const bodyLower = body.toLowerCase();
  const text = subjectLower + " " + bodyLower;
  
  if (text.includes("offer") || text.includes("bid") || text.includes("proposal")) {
    return "offer";
  } else if (text.includes("listing") || text.includes("sell") || text.includes("market")) {
    return "listing";
  } else if (text.includes("showing") || text.includes("tour") || text.includes("visit")) {
    return "showing";
  } else if (text.includes("closing") || text.includes("escrow") || text.includes("settlement")) {
    return "closing";
  } else {
    return "general";
  }
}

// AI Tool for email drafting
export const draftEmailTool = tool({
  name: "draftEmail",
  description: "Draft an email for a client",
  parameters: z.object({
    recipient: z.string().describe("Name of the recipient"),
    recipientEmail: z.string().describe("Email address of the recipient"),
    subject: z.string().describe("Subject line of the email"),
    purpose: z.string().describe("Purpose of the email (listing, showing, offer, closing, general)"),
    propertyAddress: z.string().optional().describe("Optional property address relevant to the email"),
    additionalDetails: z.string().optional().describe("Optional additional details to include in the email"),
    senderName: z.string().optional().describe("Optional name of the sender (defaults to 'Real Estate Agent')"),
  }),
  execute: async ({ recipient, recipientEmail, subject, purpose, propertyAddress, additionalDetails, senderName }) => {
    try {
      const emailDraft = await draftEmail(
        recipient,
        recipientEmail,
        subject,
        purpose,
        propertyAddress,
        additionalDetails,
        senderName
      );
      
      // Categorize the email
      const category = await categorizeEmail(subject, emailDraft.body);
      
      return {
        ...emailDraft,
        category,
      };
    } catch (error) {
      console.error("Error in email drafting tool:", error);
      throw new Error("Failed to draft email. Please try again or contact support.");
    }
  },
});

// AI Tool for sending emails
export const sendEmailTool = tool({
  name: "sendEmail",
  description: "Send an email to a client",
  parameters: z.object({
    to: z.string().describe("Email address of the recipient"),
    subject: z.string().describe("Subject line of the email"),
    body: z.string().describe("Body content of the email"),
    fromName: z.string().optional().describe("Optional name of the sender"),
  }),
  execute: async ({ to, subject, body, fromName }) => {
    try {
      const result = await sendEmail(
        to,
        subject,
        body,
        process.env.MAILERSEND_FROM_EMAIL,
        fromName || process.env.MAILERSEND_FROM_NAME
      );
      
      return result;
    } catch (error) {
      console.error("Error in email sending tool:", error);
      throw new Error("Failed to send email. Please try again or contact support.");
    }
  },
}); 