"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  FileText,
  Home,
  Mail,
  MessageSquare,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import AiAgentChat from "@/components/AiAgentChat";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flags";

// Mock data for dashboard
const mockUpcomingAppointments = [
  {
    id: 1,
    title: "Property Showing - 123 Main St",
    client: "John Smith",
    date: "Today",
    time: "2:00 PM - 3:00 PM",
  },
  {
    id: 2,
    title: "Client Meeting - Sarah Johnson",
    client: "Sarah Johnson",
    date: "Tomorrow",
    time: "10:30 AM - 11:30 AM",
  },
  {
    id: 3,
    title: "Open House - 456 Oak Ave",
    client: null,
    date: "Saturday",
    time: "1:00 PM - 4:00 PM",
  },
];

const mockRecentEmails = [
  {
    id: 1,
    from: "David Wilson",
    subject: "Closing documents for 321 Elm St",
    time: "10:30 AM",
    unread: true,
  },
  {
    id: 2,
    from: "Michael Brown",
    subject: "Questions about 789 Pine St inspection",
    time: "Yesterday",
    unread: false,
  },
];

const mockMarketUpdates = [
  {
    id: 1,
    neighborhood: "Downtown",
    change: "+5.2%",
    trend: "up",
  },
  {
    id: 2,
    neighborhood: "Westside",
    change: "+3.8%",
    trend: "up",
  },
  {
    id: 3,
    neighborhood: "Northridge",
    change: "+6.5%",
    trend: "up",
  },
];

const mockTasks = [
  {
    id: 1,
    title: "Follow up with John Smith about offer",
    priority: "high",
    dueDate: "Today",
  },
  {
    id: 2,
    title: "Prepare listing presentation for 555 Maple Dr",
    priority: "medium",
    dueDate: "Tomorrow",
  },
  {
    id: 3,
    title: "Review closing documents for 321 Elm St",
    priority: "high",
    dueDate: "Friday",
  },
];

export default function DashboardPage() {
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const isMarketAnalysisEnabled = useSchematicFlag(
    FeatureFlag.MARKET_ANALYSIS
  );
  const isCalendarManagementEnabled = useSchematicFlag(
    FeatureFlag.CALENDAR_MANAGEMENT
  );
  const isEmailManagementEnabled = useSchematicFlag(
    FeatureFlag.EMAIL_MANAGEMENT
  );
  const isReportGenerationEnabled = useSchematicFlag(
    FeatureFlag.REPORT_GENERATION
  );
  const isDocumentManagementEnabled = useSchematicFlag(
    FeatureFlag.DOCUMENT_MANAGEMENT
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's an overview of your real estate business
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {showAIAssistant ? "Hide AI Assistant" : "AI Assistant"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className={`lg:col-span-${showAIAssistant ? "3" : "4"}`}>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Appointments</p>
                  <p className="text-2xl font-semibold mt-1">8</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                <span className="font-medium">+2</span> from last week
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New Leads</p>
                  <p className="text-2xl font-semibold mt-1">12</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                <span className="font-medium">+5</span> from last week
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Listings</p>
                  <p className="text-2xl font-semibold mt-1">5</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                <span className="font-medium">+1</span> from last week
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Sales</p>
                  <p className="text-2xl font-semibold mt-1">3</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <p className="text-xs text-yellow-600 mt-2">Same as last week</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                <Link
                  href="/calendar"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {mockUpcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <h3 className="font-medium">{appointment.title}</h3>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>
                        {appointment.client
                          ? `Client: ${appointment.client}`
                          : "Open Event"}
                      </span>
                      <span>
                        {appointment.date}, {appointment.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                disabled={!isCalendarManagementEnabled}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                {isCalendarManagementEnabled ? (
                  <span>Schedule New Appointment</span>
                ) : (
                  <span>Upgrade for Calendar Management</span>
                )}
              </button>
            </div>

            {/* Recent Emails */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Recent Emails</h2>
                <Link
                  href="/emails"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {mockRecentEmails.map((email) => (
                  <div
                    key={email.id}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {email.unread && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          )}
                          {email.from}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {email.subject}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{email.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                disabled={!isEmailManagementEnabled}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4" />
                {isEmailManagementEnabled ? (
                  <span>Compose New Email</span>
                ) : (
                  <span>Upgrade for Email Management</span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Market Updates */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Market Updates</h2>
                <Link
                  href="/market-analysis"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {mockMarketUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="font-medium">{update.neighborhood}</span>
                    <span
                      className={`${
                        update.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {update.change}
                    </span>
                  </div>
                ))}
              </div>
              <button
                disabled={!isMarketAnalysisEnabled}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BarChart3 className="w-4 h-4" />
                {isMarketAnalysisEnabled ? (
                  <span>Generate Market Analysis</span>
                ) : (
                  <span>Upgrade for Market Analysis</span>
                )}
              </button>
            </div>

            {/* Tasks */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <div className="flex justify-between text-sm mt-1">
                        <span
                          className={`${
                            task.priority === "high"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>
                        <span className="text-gray-500">Due: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                disabled={!isReportGenerationEnabled}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                {isReportGenerationEnabled ? (
                  <span>Generate Property Report</span>
                ) : (
                  <span>Upgrade for Report Generation</span>
                )}
              </button>
            </div>
          </div>

          {/* Document Management Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Documents</h2>
              <Link
                href="/documents"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Purchase Agreement - 123 Main St.pdf</h3>
                    <p className="text-sm text-gray-500 mt-1">Uploaded: June 15, 2023</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Disclosure Form - 456 Oak Ave.pdf</h3>
                    <p className="text-sm text-gray-500 mt-1">Uploaded: June 10, 2023</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Inspection Report - 789 Pine St.pdf</h3>
                    <p className="text-sm text-gray-500 mt-1">Uploaded: June 8, 2023</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              disabled={!isDocumentManagementEnabled}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => window.location.href = '/documents'}
            >
              <FileText className="w-4 h-4" />
              {isDocumentManagementEnabled ? (
                <span>Upload New Document</span>
              ) : (
                <span>Upgrade for Document Management</span>
              )}
            </button>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm h-[800px] overflow-hidden flex flex-col">
            <AiAgentChat context="dashboard" />
          </div>
        )}
      </div>
    </div>
  );
} 