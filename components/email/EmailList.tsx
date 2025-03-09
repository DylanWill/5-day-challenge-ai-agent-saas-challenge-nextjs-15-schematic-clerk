"use client";

import { useState } from "react";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Clock,
  Edit,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Reply,
  Search,
  Star,
  Trash,
  Forward,
} from "lucide-react";
import { 
  markEmailAsRead, 
  markEmailAsUnread, 
  starGmailEmail, 
  unstarGmailEmail, 
  archiveGmailEmail, 
  trashGmailEmail 
} from "@/actions/gmail";
import { useRouter } from "next/navigation";

// Category and priority colors
const categoryColors = {
  client: "bg-blue-100 text-blue-800",
  newsletter: "bg-green-100 text-green-800",
  management: "bg-purple-100 text-purple-800",
  administrative: "bg-gray-100 text-gray-800",
  default: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
  default: "bg-gray-100 text-gray-800",
};

interface EmailListProps {
  emails: any[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  selectedPriority: string | null;
  sortBy: "date" | "priority";
  sortDirection: "asc" | "desc";
  toggleSort: (type: "date" | "priority") => void;
  onRefresh: () => void;
}

export default function EmailList({
  emails,
  isLoading,
  error,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  selectedPriority,
  sortBy,
  sortDirection,
  toggleSort,
  onRefresh,
}: EmailListProps) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Filter emails based on search term, category, and priority
  const filteredEmails = emails
    .filter(
      (email) =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (email.snippet && email.snippet.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(
      (email) => !selectedCategory || email.category === selectedCategory
    )
    .filter(
      (email) => !selectedPriority || email.priority === selectedPriority
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        // Sort by date
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === "desc"
          ? dateB - dateA
          : dateA - dateB;
      } else {
        // Priority sort
        const priorityValues = { high: 3, medium: 2, low: 1 };
        const priorityA = priorityValues[a.priority as keyof typeof priorityValues] || 0;
        const priorityB = priorityValues[b.priority as keyof typeof priorityValues] || 0;
        return sortDirection === "desc"
          ? priorityB - priorityA
          : priorityA - priorityB;
      }
    });

  // Handle email selection
  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId]
    );
  };

  // Handle bulk actions
  const handleBulkAction = async (action: 'read' | 'unread' | 'star' | 'unstar' | 'archive' | 'trash') => {
    if (selectedEmails.length === 0) return;
    
    setActionLoading(action);
    
    try {
      const promises = selectedEmails.map(async (emailId) => {
        switch (action) {
          case 'read':
            return markEmailAsRead(emailId);
          case 'unread':
            return markEmailAsUnread(emailId);
          case 'star':
            return starGmailEmail(emailId);
          case 'unstar':
            return unstarGmailEmail(emailId);
          case 'archive':
            return archiveGmailEmail(emailId);
          case 'trash':
            return trashGmailEmail(emailId);
        }
      });
      
      await Promise.all(promises);
      
      // Clear selection and refresh emails
      setSelectedEmails([]);
      onRefresh();
    } catch (error) {
      console.error(`Error performing bulk action ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle single email actions
  const handleEmailAction = async (emailId: string, action: 'read' | 'unread' | 'star' | 'unstar' | 'archive' | 'trash') => {
    setActionLoading(emailId);
    
    try {
      switch (action) {
        case 'read':
          await markEmailAsRead(emailId);
          break;
        case 'unread':
          await markEmailAsUnread(emailId);
          break;
        case 'star':
          await starGmailEmail(emailId);
          break;
        case 'unstar':
          await unstarGmailEmail(emailId);
          break;
        case 'archive':
          await archiveGmailEmail(emailId);
          break;
        case 'trash':
          await trashGmailEmail(emailId);
          break;
      }
      
      // Refresh emails
      onRefresh();
    } catch (error) {
      console.error(`Error performing action ${action} on email ${emailId}:`, error);
    } finally {
      setActionLoading(null);
      setShowActionMenu(null);
    }
  };

  // View email details
  const viewEmail = (emailId: string, threadId: string) => {
    router.push(`/email/${threadId}?messageId=${emailId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Search and sort controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search emails..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => toggleSort("date")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Clock className="w-4 h-4" />
            <span>Date</span>
            {sortBy === "date" && (
              <span>
                {sortDirection === "desc" ? (
                  <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUp className="w-3 h-3" />
                )}
              </span>
            )}
          </button>
          <button
            onClick={() => toggleSort("priority")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Filter className="w-4 h-4" />
            <span>Priority</span>
            {sortBy === "priority" && (
              <span>
                {sortDirection === "desc" ? (
                  <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUp className="w-3 h-3" />
                )}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedEmails.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between mb-4">
          <div className="text-sm text-blue-800">
            {selectedEmails.length} {selectedEmails.length === 1 ? 'email' : 'emails'} selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('read')}
              disabled={actionLoading !== null}
              className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-md"
              title="Mark as read"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleBulkAction('star')}
              disabled={actionLoading !== null}
              className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-md"
              title="Star"
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleBulkAction('archive')}
              disabled={actionLoading !== null}
              className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-md"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleBulkAction('trash')}
              disabled={actionLoading !== null}
              className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-md"
              title="Delete"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Email list */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <Mail className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Error loading emails</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Mail className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No emails found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory || selectedPriority
              ? "Try adjusting your search or filters"
              : "Your inbox is empty"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`p-3 border ${
                email.read ? "border-gray-100" : "border-blue-200 bg-blue-50"
              } rounded-lg hover:border-blue-300 transition-colors relative ${
                selectedEmails.includes(email.id) ? "border-blue-500 bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox for selection */}
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email.id)}
                    onChange={() => toggleEmailSelection(email.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
                
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium"
                    onClick={() => viewEmail(email.id, email.threadId)}
                  >
                    {email.from.split('<')[0].trim().charAt(0)}
                  </div>
                </div>
                
                {/* Email content */}
                <div 
                  className="flex-grow min-w-0 cursor-pointer"
                  onClick={() => viewEmail(email.id, email.threadId)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{email.from.split('<')[0].trim()}</span>
                    <span className="text-xs text-gray-500">{formatDate(email.date)}</span>
                    {email.starred && (
                      <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="font-medium text-sm mb-1 truncate">
                    {email.subject}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {email.snippet}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        categoryColors[
                          email.category as keyof typeof categoryColors
                        ] || categoryColors.default
                      }`}
                    >
                      {email.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        priorityColors[
                          email.priority as keyof typeof priorityColors
                        ] || priorityColors.default
                      }`}
                    >
                      {email.priority} priority
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex-shrink-0 flex gap-1 relative">
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    onClick={() => handleEmailAction(email.id, email.starred ? 'unstar' : 'star')}
                    disabled={actionLoading === email.id}
                  >
                    <Star className={`w-4 h-4 ${email.starred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    onClick={() => handleEmailAction(email.id, 'archive')}
                    disabled={actionLoading === email.id}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    onClick={() => handleEmailAction(email.id, 'trash')}
                    disabled={actionLoading === email.id}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    onClick={() => setShowActionMenu(showActionMenu === email.id ? null : email.id)}
                    disabled={actionLoading === email.id}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {/* Action menu */}
                  {showActionMenu === email.id && (
                    <div className="absolute right-0 top-8 z-10 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => viewEmail(email.id, email.threadId)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => router.push(`/email/compose?reply=${email.id}`)}
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => router.push(`/email/compose?forward=${email.id}`)}
                      >
                        <Forward className="w-4 h-4 mr-2" />
                        Forward
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleEmailAction(email.id, email.read ? 'unread' : 'read')}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Mark as {email.read ? 'unread' : 'read'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Loading overlay */}
              {actionLoading === email.id && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 