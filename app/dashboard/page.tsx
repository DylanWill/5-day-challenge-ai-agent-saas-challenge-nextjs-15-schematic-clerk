"use client";

import { useState } from "react";
import {
  Calendar,
  Home,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import AiAgentChat from "@/components/AiAgentChat";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flags";

export default function DashboardPage() {
  const [showAIAssistant, setShowAIAssistant] = useState(true);

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

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[200px] flex-1">
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

        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[200px] flex-1">
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

        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[200px] flex-1">
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

        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[200px] flex-1">
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

      {/* AI Assistant */}
      {showAIAssistant && (
        <div className="col-span-full mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-[600px]">
            <AiAgentChat />
          </div>
        </div>
      )}
    </div>
  );
} 