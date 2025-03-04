"use client";

import { Message, useChat } from "@ai-sdk/react";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flags";
import { BarChart3, BotIcon, Calendar, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  result?: Record<string, unknown>;
}

interface ToolPart {
  type: "tool-invocation";
  toolInvocation: ToolInvocation;
}

const formatToolInvocation = (part: ToolPart) => {
  if (!part.toolInvocation) return "Unknown Tool";
  return `🔧 Tool Used: ${part.toolInvocation.toolName}`;
};

function AiAgentChat({ context }: { context?: string }) {
  // Scrolling to Bottom Logic
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, append, status } =
    useChat({
      maxSteps: 5,
      body: {
        context,
      },
    });

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

  useEffect(() => {
    if (bottomRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let toastId;

    switch (status) {
      case "submitted":
        toastId = toast("Agent is thinking...", {
          id: toastId,
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;
      case "streaming":
        toastId = toast("Agent is replying...", {
          id: toastId,
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;
      case "error":
        toastId = toast("Whoops! Something went wrong, please try again.", {
          id: toastId,
          icon: <BotIcon className="w-4 h-4" />,
        });
        break;
      case "ready":
        toast.dismiss(toastId);
        break;
    }
  }, [status]);

  const generateMarketAnalysis = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const userMessage: Message = {
      id: `market-analysis-${randomId}`,
      role: "user",
      content:
        "Generate a market analysis for Downtown area. I'm interested in single-family homes.",
    };
    append(userMessage);
  };

  const scheduleAppointment = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const userMessage: Message = {
      id: `schedule-appointment-${randomId}`,
      role: "user",
      content:
        "Schedule a property showing for 123 Main St with John Smith tomorrow at 2:00 PM for 1 hour.",
    };
    append(userMessage);
  };

  const draftClientEmail = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const userMessage: Message = {
      id: `draft-email-${randomId}`,
      role: "user",
      content:
        "Draft an email to Sarah Johnson at sarah.johnson@example.com about the offer we received for 456 Oak Ave.",
    };
    append(userMessage);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        ref={messagesContainerRef}
      >
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-700">
                  Welcome to Real Estate AI Assistant
                </h3>
                <p className="text-sm text-gray-500">
                  Ask any question about real estate, schedule appointments, draft emails, or generate reports!
                </p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] ${
                  m.role === "user" ? "bg-blue-500" : "bg-gray-100"
                } rounded-2xl px-4 py-3`}
              >
                {m.parts && m.role === "assistant" ? (
                  // AI message
                  <div className="space-y-3">
                    {m.parts.map((part, i) =>
                      part.type === "text" ? (
                        <div key={i} className="prose prose-sm max-w-none">
                          <ReactMarkdown>{part.text}</ReactMarkdown>
                        </div>
                      ) : part.type === "tool-invocation" ? (
                        <div
                          key={i}
                          className="bg-white/50 rounded-lg p-2 space-y-2 text-gray-800 "
                        >
                          <div className="font-medium text-xs">
                            {formatToolInvocation(part as ToolPart)}
                          </div>
                          {(part as ToolPart).toolInvocation.result && (
                            <pre className="text-xs bg-white/75 p-2 rounded overflow-auto max-h-40">
                              {JSON.stringify(
                                (part as ToolPart).toolInvocation.result,
                                null,
                                2
                              )}
                            </pre>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  // User message
                  <div className="prose prose-sm max-w-none text-white">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input form */}
      <div className="border-t border-gray-100 p-4 bg-white">
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              placeholder="Ask anything about real estate..."
              value={input}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              disabled={status === "streaming" || status === "submitted"}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "streaming"
                ? "AI is replying..."
                : status === "submitted"
                  ? "AI is thinking..."
                  : "Send"}
            </Button>
          </form>

          <div className="flex gap-2">
            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateMarketAnalysis}
              type="button"
              disabled={!isMarketAnalysisEnabled}
            >
              <BarChart3 className="w-4 h-4" />
              {isMarketAnalysisEnabled ? (
                <span>Market Analysis</span>
              ) : (
                <span>Upgrade for Market Analysis</span>
              )}
            </button>

            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={scheduleAppointment}
              type="button"
              disabled={!isCalendarManagementEnabled}
            >
              <Calendar className="w-4 h-4" />
              {isCalendarManagementEnabled ? (
                <span>Schedule Appointment</span>
              ) : (
                <span>Upgrade for Calendar</span>
              )}
            </button>

            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={draftClientEmail}
              type="button"
              disabled={!isEmailManagementEnabled}
            >
              <Mail className="w-4 h-4" />
              {isEmailManagementEnabled ? (
                <span>Draft Email</span>
              ) : (
                <span>Upgrade for Email</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAgentChat;
