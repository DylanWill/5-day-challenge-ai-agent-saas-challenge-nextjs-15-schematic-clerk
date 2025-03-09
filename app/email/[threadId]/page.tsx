"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Forward,
  Mail,
  MailPlus,
  Reply,
  Star,
  Trash,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { fetchEmailThread, markEmailAsRead } from "@/actions/gmail";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function EmailThreadPage({ params }: { params: { threadId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageId = searchParams.get("messageId");
  const threadId = params.threadId;
  
  const [thread, setThread] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<string[]>([]);
  
  const { isAuthenticated: isGoogleAuthenticated } = useGoogleAuth();

  // Fetch thread when the component mounts
  useEffect(() => {
    if (isGoogleAuthenticated) {
      fetchThreadData();
    } else {
      setIsLoading(false);
    }
  }, [isGoogleAuthenticated, threadId]);

  // Mark message as read when viewed
  useEffect(() => {
    if (messageId && isGoogleAuthenticated && !isLoading) {
      markEmailAsRead(messageId);
    }
  }, [messageId, isGoogleAuthenticated, isLoading]);

  // Function to fetch thread data
  const fetchThreadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchEmailThread(threadId);
      
      if (result.success && result.thread) {
        setThread(result.thread);
        
        // Expand the message that was clicked
        if (messageId) {
          setExpandedMessages([messageId]);
        } else if (result.thread.messages && result.thread.messages.length > 0) {
          // Expand the latest message if no specific message was requested
          setExpandedMessages([result.thread.messages[result.thread.messages.length - 1].id]);
        }
      } else {
        setError(result.error || 'Failed to fetch email thread');
      }
    } catch (error) {
      console.error('Error fetching email thread:', error);
      setError('An error occurred while fetching the email thread');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle message expansion
  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render HTML content safely
  const renderHtmlContent = (html: string) => {
    return { __html: html };
  };

  // Redirect to login if not authenticated
  if (!isGoogleAuthenticated && !isLoading) {
    router.push('/email');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/email"
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {thread?.messages?.[0]?.subject || 'Email Thread'}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Error loading email thread</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      ) : thread ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Thread actions */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <Archive className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <Trash className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <Mail className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/email/compose?reply=${messageId || thread.messages[thread.messages.length - 1].id}`}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
              >
                <Reply className="w-4 h-4" />
                Reply
              </Link>
              <Link
                href={`/email/compose?forward=${messageId || thread.messages[thread.messages.length - 1].id}`}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Forward className="w-4 h-4" />
                Forward
              </Link>
            </div>
          </div>

          {/* Thread messages */}
          <div className="divide-y divide-gray-100">
            {thread.messages.map((message: any, index: number) => (
              <div key={message.id} className="p-4">
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleMessageExpansion(message.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.from.split('<')[0].trim()}</span>
                        <span className="text-xs text-gray-500">{formatDate(message.date)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        To: {message.to.split('<')[0].trim()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-400 hover:text-yellow-500">
                      <Star className={`w-5 h-5 ${message.isStarred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                    </button>
                    <button className="p-1 text-gray-400">
                      {expandedMessages.includes(message.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Message content */}
                {expandedMessages.includes(message.id) && (
                  <div className="mt-4 pl-12">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={renderHtmlContent(message.body)}
                    />
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                        <div className="flex flex-wrap gap-3">
                          {message.attachments.map((attachment: any) => (
                            <div 
                              key={attachment.id}
                              className="border border-gray-200 rounded-lg p-3 flex items-center gap-2 bg-gray-50"
                            >
                              <div className="text-sm">
                                <div className="font-medium">{attachment.filename}</div>
                                <div className="text-xs text-gray-500">
                                  {Math.round(attachment.size / 1024)} KB
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/email/compose?reply=${message.id}`}
                        className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-1 hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Reply className="w-3 h-3" />
                        Reply
                      </Link>
                      <Link
                        href={`/email/compose?forward=${message.id}`}
                        className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg flex items-center gap-1 hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Forward className="w-3 h-3" />
                        Forward
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Mail className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">Email not found</h3>
          <p className="text-gray-500 mb-4">
            The email thread you're looking for doesn't exist or has been deleted.
          </p>
          <Link
            href="/email"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inbox
          </Link>
        </div>
      )}
    </div>
  );
} 