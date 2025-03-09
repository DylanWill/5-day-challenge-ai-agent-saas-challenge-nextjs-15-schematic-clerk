"use client";

import { useState } from "react";
import {
  BarChart3,
  Brain,
  Download,
  FileText,
  Filter,
  Home,
  Mail,
  Plus,
  Search,
  Share2,
  X,
} from "lucide-react";
import Link from "next/link";
import AiAgentChat from "@/components/AiAgentChat";

// Mock data for reports
const mockReports = [
  {
    id: 1,
    title: "Comparative Market Analysis - 123 Main St",
    client: "John Smith",
    date: "June 15, 2023",
    type: "CMA",
    properties: 5,
    status: "Completed",
  },
  {
    id: 2,
    title: "Investment Property Analysis - Westside Portfolio",
    client: "Sarah Johnson",
    date: "June 10, 2023",
    type: "Investment",
    properties: 3,
    status: "Completed",
  },
  {
    id: 3,
    title: "Neighborhood Trend Report - Northridge",
    client: "Michael Brown",
    date: "June 8, 2023",
    type: "Trend",
    properties: 12,
    status: "Completed",
  },
  {
    id: 4,
    title: "Pre-Listing Analysis - 456 Oak Ave",
    client: "David Wilson",
    date: "June 5, 2023",
    type: "Pre-Listing",
    properties: 1,
    status: "Completed",
  },
  {
    id: 5,
    title: "Buyer Recommendation Report - Downtown Condos",
    client: "Emily Davis",
    date: "June 1, 2023",
    type: "Buyer",
    properties: 8,
    status: "Completed",
  },
];

// Report type colors
const reportTypeColors = {
  CMA: "bg-blue-100 text-blue-800",
  Investment: "bg-green-100 text-green-800",
  Trend: "bg-purple-100 text-purple-800",
  "Pre-Listing": "bg-yellow-100 text-yellow-800",
  Buyer: "bg-red-100 text-red-800",
};

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Filter reports based on search term and type
  const filteredReports = mockReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedType || report.type === selectedType)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">
            Create and manage property reports and market analyses
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
          >
            <Brain className="w-4 h-4" />
            {showAIAssistant ? "Hide AI Assistant" : "AI Report Assistant"}
          </button>
          <Link
            href="/reports/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Report
          </Link>
          <Link
            href="/reports/charts-demo"
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Chart Types
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="relative mb-6">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-sm text-gray-500 mb-2 px-3">
                REPORT TYPES
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() =>
                    setSelectedType(selectedType === "CMA" ? null : "CMA")
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedType === "CMA"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Comparative Market Analysis</span>
                </button>
                <button
                  onClick={() =>
                    setSelectedType(
                      selectedType === "Investment" ? null : "Investment"
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedType === "Investment"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Investment Analysis</span>
                </button>
                <button
                  onClick={() =>
                    setSelectedType(selectedType === "Trend" ? null : "Trend")
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedType === "Trend"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Neighborhood Trends</span>
                </button>
                <button
                  onClick={() =>
                    setSelectedType(
                      selectedType === "Pre-Listing" ? null : "Pre-Listing"
                    )
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedType === "Pre-Listing"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Pre-Listing Analysis</span>
                </button>
                <button
                  onClick={() =>
                    setSelectedType(selectedType === "Buyer" ? null : "Buyer")
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    selectedType === "Buyer"
                      ? "bg-blue-50 text-blue-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Buyer Recommendation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!showAIAssistant ? (
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Your Reports</h2>

            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        Client: {report.client}
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {report.date}
                      </div>
                      <div className="text-sm text-gray-500">
                        Properties: {report.properties}
                      </div>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        reportTypeColors[report.type as keyof typeof reportTypeColors]
                      }`}
                    >
                      {report.type}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      View
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
            <div className="h-[600px]">
              <AiAgentChat context="property reports" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}