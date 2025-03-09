"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  Mail,
  MailPlus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import AiAgentChat from "@/components/AiAgentChat";
import { fetchEmails } from "@/actions/gmail";
import EmailList from "@/components/email/EmailList";
import EmailSidebar from "@/components/email/EmailSidebar";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

// Helper function to determine email category
function determineCategory(email: any) {
  const from = email.from?.toLowerCase() || '';
  const subject = email.subject?.toLowerCase() || '';
  
  if (from.includes("newsletter") || from.includes("weekly") || from.includes("update")) {
    return "newsletter";
  } else if (subject.includes("property") || subject.includes("listing") || subject.includes("offer")) {
    return "client";
  } else if (subject.includes("report") || subject.includes("management")) {
    return "management";
  } else {
    return "administrative";
  }
}

// Helper function to determine email priority
function determinePriority(email: any) {
  const subject = email.subject?.toLowerCase() || '';
  
  if (subject.includes("urgent") || subject.includes("important") || subject.includes("offer")) {
    return "high";
  } else if (subject.includes("update") || subject.includes("question")) {
    return "medium";
  } else {
    return "low";
  }
}

export default function EmailPage() {
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Use the useGoogleAuth hook instead of managing state directly
  const { 
    isAuthenticated: isGoogleAuthenticated, 
    isLoading: isGoogleAuthLoading, 
    error: googleAuthError,
    connectGoogle
  } = useGoogleAuth();

  // Check for URL parameters
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setSuccessMessage(null);
      setError(errorParam);
    }
    
    const googleConnected = searchParams.get('google_connected');
    if (googleConnected === 'true') {
      setError(null);
      setSuccessMessage('Successfully connected to Google!');
      
      // Refresh the page after 3 seconds to check Google auth status
      setTimeout(() => {
        window.location.href = '/email';
      }, 3000);
    }
  }, [searchParams]);

  // Fetch emails when the component mounts
  useEffect(() => {
    if (isGoogleAuthenticated) {
      fetchEmailData();
    } else {
      setIsLoading(false);
    }
  }, [isGoogleAuthenticated]);

  // Function to fetch email data
  const fetchEmailData = async () => {
    if (!isGoogleAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchEmails(50);
      
      if (result.success) {
        // Process emails to add category and priority
        const processedEmails = result.emails.map((email: any) => ({
          ...email,
          category: determineCategory(email),
          priority: determinePriority(email),
          read: !email.labelIds?.includes('UNREAD'),
          starred: email.labelIds?.includes('STARRED'),
        }));
        
        setEmails(processedEmails);
      } else {
        setError(result.error || 'Failed to fetch emails');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('An error occurred while fetching emails');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEmailData();
  };

  // Toggle sort
  const toggleSort = (type: "date" | "priority") => {
    if (sortBy === type) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortDirection("desc");
    }
  };

  // Calculate counts
  const unreadCount = emails.filter(email => !email.read).length;
  const starredCount = emails.filter(email => email.starred).length;

  // Show loading state while checking authentication
  if (!isAuthLoaded || isGoogleAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Render Google authentication prompt if not authenticated
  if (!isGoogleAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Management</h1>
            <p className="text-gray-600 mt-2">
              Connect your Google account to access your emails
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mb-6">
            <Mail className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Google Account</h2>
            <p className="text-gray-600 mb-6">
              To access your emails, you need to connect your Google account. This will allow the application to read and manage your emails.
            </p>
            {googleAuthError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{googleAuthError}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            <button
              onClick={connectGoogle}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors mx-auto"
            >
              <Mail className="w-5 h-5" />
              Connect Google Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Management</h1>
          <p className="text-gray-600 mt-2">
            Organize, prioritize, and respond to your emails efficiently
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Refresh emails"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
          >
            <Brain className="w-4 h-4" />
            {showAIAssistant ? "Hide AI Assistant" : "AI Email Assistant"}
          </button>
          <Link
            href="/email/compose"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <MailPlus className="w-4 h-4" />
            Compose
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <EmailSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            unreadCount={unreadCount}
            starredCount={starredCount}
          />
        </div>

        {/* Main Content */}
        {!showAIAssistant ? (
          <div className="lg:col-span-3">
            <EmailList
              emails={emails}
              isLoading={isLoading}
              error={error}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              selectedPriority={selectedPriority}
              sortBy={sortBy}
              sortDirection={sortDirection}
              toggleSort={toggleSort}
              onRefresh={fetchEmailData}
            />
          </div>
        ) : (
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm h-[800px] overflow-hidden flex flex-col">
            <AiAgentChat context="email management" />
          </div>
        )}
      </div>
    </div>
  );
} 