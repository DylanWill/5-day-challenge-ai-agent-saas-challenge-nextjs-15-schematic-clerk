"use client";

import { useState } from "react";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Brain,
  Clock,
  Edit,
  Filter,
  Inbox,
  Mail,
  MailPlus,
  Search,
  Star,
  Tag,
  Trash,
  X,
} from "lucide-react";
import Link from "next/link";
import AiAgentChat from "@/components/AiAgentChat";

// Mock data for emails
const mockEmails = [
  {
    id: 1,
    from: "John Smith",
    email: "john.smith@example.com",
    subject: "Interested in 123 Main St property",
    preview:
      "Hello, I saw your listing for 123 Main St and I'm very interested in scheduling a viewing. I'm particularly...",
    date: "10:30 AM",
    read: false,
    starred: true,
    category: "client",
    priority: "high",
  },
  {
    id: 2,
    from: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    subject: "Questions about our offer",
    preview:
      "Hi, we submitted an offer for 456 Oak Ave yesterday and I wanted to follow up on a few questions regarding...",
    date: "Yesterday",
    read: true,
    starred: true,
    category: "client",
    priority: "high",
  },
  {
    id: 3,
    from: "Michael Brown",
    email: "michael.brown@example.com",
    subject: "Inspection report for 789 Pine St",
    preview:
      "I've attached the inspection report for 789 Pine St. There are a few minor issues that need to be addressed...",
    date: "Yesterday",
    read: true,
    starred: false,
    category: "client",
    priority: "medium",
  },
  {
    id: 4,
    from: "Real Estate Weekly",
    email: "newsletter@realestateweekly.com",
    subject: "This Week's Market Trends and New Listings",
    preview:
      "In this week's newsletter: Market trends show a 5% increase in home values in your area, plus 15 new listings...",
    date: "Jun 12",
    read: true,
    starred: false,
    category: "newsletter",
    priority: "low",
  },
  {
    id: 5,
    from: "David Wilson",
    email: "david.wilson@example.com",
    subject: "Closing documents for 321 Elm St",
    preview:
      "Please find attached the closing documents for 321 Elm St. We need these signed and returned by Friday to proceed...",
    date: "Jun 11",
    read: false,
    starred: true,
    category: "client",
    priority: "high",
  },
  {
    id: 6,
    from: "Property Management Inc.",
    email: "info@propertymanagement.com",
    subject: "Monthly rental property report",
    preview:
      "Here is your monthly report for your rental properties. All units are currently occupied with rent payments up to date...",
    date: "Jun 10",
    read: true,
    starred: false,
    category: "management",
    priority: "medium",
  },
  {
    id: 7,
    from: "City Planning Department",
    email: "planning@citygovernment.org",
    subject: "Zoning changes in Downtown district",
    preview:
      "This is to inform all registered real estate professionals about upcoming zoning changes in the Downtown district that may affect...",
    date: "Jun 9",
    read: true,
    starred: false,
    category: "administrative",
    priority: "medium",
  },
];

// Category and priority colors
const categoryColors = {
  client: "bg-blue-100 text-blue-800",
  newsletter: "bg-green-100 text-green-800",
  management: "bg-purple-100 text-purple-800",
  administrative: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

export default function EmailPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter emails based on search term, category, and priority
  const filteredEmails = mockEmails
    .filter(
      (email) =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (email) => !selectedCategory || email.category === selectedCategory
    )
    .filter(
      (email) => !selectedPriority || email.priority === selectedPriority
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        // Simple sort for demo purposes
        return sortDirection === "desc"
          ? b.id - a.id
          : a.id - b.id;
      } else {
        // Priority sort
        const priorityValues = { high: 3, medium: 2, low: 1 };
        const priorityA = priorityValues[a.priority as keyof typeof priorityValues];
        const priorityB = priorityValues[b.priority as keyof typeof priorityValues];
        return sortDirection === "desc"
          ? priorityB - priorityA
          : priorityA - priorityB;
      }
    });

  const toggleSort = (type: "date" | "priority") => {
    if (sortBy === type) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortDirection("desc");
    }
  };

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
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="space-y-1 mb-6">
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium">
                <Inbox className="w-4 h-4" />
                <span>Inbox</span>
                <span className="ml-auto bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                  2
                </span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                <Star className="w-4 h-4" />
                <span>Starred</span>
                <span className="ml-auto bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                  3
                </span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                <Clock className="w-4 h-4" />
                <span>Snoozed</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                <Archive className="w-4 h-4" />
                <span>Archived</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                <Trash className="w-4 h-4" />
                <span>Trash</span>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-sm text-gray-500 mb-2 px-3">
                CATEGORIES
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === "client" ? null : "client"
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === "client"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Clients</span>
                </button>
                <button
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === "newsletter" ? null : "newsletter"
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === "newsletter"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Newsletters</span>
                </button>
                <button
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === "management" ? null : "management"
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === "management"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Management</span>
                </button>
                <button
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === "administrative"
                        ? null
                        : "administrative"
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === "administrative"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Administrative</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2 px-3">
                PRIORITY
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() =>
                    setSelectedPriority(
                      selectedPriority === "high" ? null : "high"
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedPriority === "high"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>High Priority</span>
                </button>
                <button
                  onClick={() =>
                    setSelectedPriority(
                      selectedPriority === "medium" ? null : "medium"
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedPriority === "medium"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Medium Priority</span>
                </button>
                <button
                  onClick={() =>
                    setSelectedPriority(
                      selectedPriority === "low" ? null : "low"
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedPriority === "low"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Low Priority</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!showAIAssistant ? (
          <div className="lg:col-span-3">
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

            <div className="space-y-2">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-3 border ${
                    email.read ? "border-gray-100" : "border-blue-200 bg-blue-50"
                  } rounded-lg hover:border-blue-300 transition-colors cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {email.from.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{email.from}</span>
                        <span className="text-xs text-gray-500">{email.date}</span>
                        {email.starred && (
                          <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="font-medium text-sm mb-1 truncate">
                        {email.subject}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {email.preview}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            categoryColors[
                              email.category as keyof typeof categoryColors
                            ]
                          }`}
                        >
                          {email.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            priorityColors[
                              email.priority as keyof typeof priorityColors
                            ]
                          }`}
                        >
                          {email.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                        <Archive className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                        <Trash className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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