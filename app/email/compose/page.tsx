"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Paperclip,
  Send,
  Trash,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { sendGmailEmail, createGmailDraft, getEmail } from "@/actions/gmail";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function ComposeEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const replyToId = searchParams.get("reply");
  const forwardId = searchParams.get("forward");
  
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  
  const { isAuthenticated: isGoogleAuthenticated } = useGoogleAuth();

  // Fetch original email for reply or forward
  useEffect(() => {
    async function fetchOriginalEmail() {
      if (!isGoogleAuthenticated || (!replyToId && !forwardId)) return;
      
      const emailId = replyToId || forwardId;
      if (!emailId) return;
      
      setIsFetchingOriginal(true);
      
      try {
        const response = await fetch(`/api/email/${emailId}`);
        const data = await response.json();
        
        if (data.success) {
          const email = data.email;
          
          if (replyToId) {
            // Set up reply
            setTo(email.from);
            setSubject(email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`);
            setBody(`\n\nOn ${new Date(email.date).toLocaleString()}, ${email.from} wrote:\n\n${email.body}`);
          } else if (forwardId) {
            // Set up forward
            setSubject(email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`);
            setBody(`\n\n---------- Forwarded message ---------\nFrom: ${email.from}\nDate: ${new Date(email.date).toLocaleString()}\nSubject: ${email.subject}\nTo: ${email.to}\n\n${email.body}`);
          }
        } else {
          setError('Failed to fetch original email');
        }
      } catch (error) {
        console.error('Error fetching original email:', error);
        setError('An error occurred while fetching the original email');
      } finally {
        setIsFetchingOriginal(false);
      }
    }
    
    fetchOriginalEmail();
  }, [isGoogleAuthenticated, replyToId, forwardId]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Send email
  const handleSendEmail = async () => {
    if (!to || !subject || !body) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await sendGmailEmail(to, subject, body);
      
      if (result.success) {
        router.push('/email');
      } else {
        setError(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError('An error occurred while sending the email');
    } finally {
      setIsLoading(false);
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createGmailDraft(to, subject, body);
      
      if (result.success) {
        setIsDraft(true);
        setTimeout(() => {
          router.push('/email');
        }, 1500);
      } else {
        setError(result.error || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setError('An error occurred while saving the draft');
    } finally {
      setIsLoading(false);
    }
  };

  // Discard email
  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard this email?')) {
      router.push('/email');
    }
  };

  // Redirect to login if not authenticated
  if (!isGoogleAuthenticated && !isFetchingOriginal) {
    router.push('/email');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/email"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {replyToId ? 'Reply to Email' : forwardId ? 'Forward Email' : 'Compose Email'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDiscard}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Trash className="w-4 h-4" />
            Discard
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isLoading || !to || !subject || !body}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </div>
      </div>

      {isFetchingOriginal ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {error && (
            <div className="bg-red-50 border-b border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {isDraft && (
            <div className="bg-green-50 border-b border-green-200 p-4 text-center text-green-700">
              Draft saved successfully! Redirecting to inbox...
            </div>
          )}
          
          <div className="p-6">
            <div className="space-y-4">
              {/* Recipients */}
              <div className="flex items-center border-b border-gray-200 pb-2">
                <div className="w-20 text-gray-500 font-medium">To:</div>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className="flex-grow px-2 py-1 focus:outline-none"
                  required
                />
                <button
                  onClick={() => setShowCc(!showCc)}
                  className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                >
                  Cc
                </button>
                <button
                  onClick={() => setShowBcc(!showBcc)}
                  className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                >
                  Bcc
                </button>
              </div>
              
              {/* Cc */}
              {showCc && (
                <div className="flex items-center border-b border-gray-200 pb-2">
                  <div className="w-20 text-gray-500 font-medium">Cc:</div>
                  <input
                    type="text"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="cc@example.com"
                    className="flex-grow px-2 py-1 focus:outline-none"
                  />
                </div>
              )}
              
              {/* Bcc */}
              {showBcc && (
                <div className="flex items-center border-b border-gray-200 pb-2">
                  <div className="w-20 text-gray-500 font-medium">Bcc:</div>
                  <input
                    type="text"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="bcc@example.com"
                    className="flex-grow px-2 py-1 focus:outline-none"
                  />
                </div>
              )}
              
              {/* Subject */}
              <div className="flex items-center border-b border-gray-200 pb-2">
                <div className="w-20 text-gray-500 font-medium">Subject:</div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="flex-grow px-2 py-1 focus:outline-none"
                  required
                />
              </div>
              
              {/* Body */}
              <div className="pt-4">
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full min-h-[300px] px-2 py-1 focus:outline-none resize-y"
                  required
                />
              </div>
              
              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="truncate max-w-[200px]">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Attachment button */}
              <div className="border-t border-gray-200 pt-4">
                <label className="cursor-pointer inline-flex items-center gap-2 text-gray-600 hover:text-gray-800">
                  <Paperclip className="w-5 h-5" />
                  <span>Attach files</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 