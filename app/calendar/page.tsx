"use client";

import { useState } from "react";
import { Calendar, Clock, Plus, Search, Tag, X } from "lucide-react";
import Link from "next/link";
import AiAgentChat from "@/components/AiAgentChat";

// Mock data for calendar events
const mockEvents = [
  {
    id: 1,
    title: "Property Showing - 123 Main St",
    date: "2023-06-15",
    time: "10:00 AM - 11:00 AM",
    type: "showing",
    client: "John Smith",
    notes: "Client is interested in 3-bedroom properties in this neighborhood",
  },
  {
    id: 2,
    title: "Client Meeting - Sarah Johnson",
    date: "2023-06-15",
    time: "1:00 PM - 2:00 PM",
    type: "meeting",
    client: "Sarah Johnson",
    notes: "Discuss new listings and review offer strategy",
  },
  {
    id: 3,
    title: "Open House - 456 Oak Ave",
    date: "2023-06-16",
    time: "12:00 PM - 3:00 PM",
    type: "open-house",
    client: null,
    notes: "Prepare marketing materials and refreshments",
  },
  {
    id: 4,
    title: "Property Inspection - 789 Pine St",
    date: "2023-06-17",
    time: "9:00 AM - 11:00 AM",
    type: "inspection",
    client: "Michael Brown",
    notes: "Meet inspector at property, bring all documentation",
  },
  {
    id: 5,
    title: "Closing - 321 Elm St",
    date: "2023-06-18",
    time: "2:00 PM - 3:30 PM",
    type: "closing",
    client: "David Wilson",
    notes: "Final walkthrough at 12:30 PM before closing",
  },
];

// Event type colors
const eventTypeColors = {
  showing: "bg-blue-100 text-blue-800",
  meeting: "bg-purple-100 text-purple-800",
  "open-house": "bg-green-100 text-green-800",
  inspection: "bg-yellow-100 text-yellow-800",
  closing: "bg-red-100 text-red-800",
};

export default function CalendarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Filter events based on search term
  const filteredEvents = mockEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your appointments, showings, and meetings
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            {showAIAssistant ? "Hide AI Assistant" : "AI Calendar Assistant"}
          </button>
          <Link
            href="/calendar/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Event
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Schedule</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Calendar Grid (simplified for demo) */}
          <div className="mb-8 grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-gray-500 text-sm py-2"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className={`border border-gray-100 p-1 h-24 ${
                  i % 7 === 0 || i % 7 === 6 ? "bg-gray-50" : ""
                } ${i === 15 ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="text-right text-sm text-gray-500 mb-1">
                  {i + 1 <= 31 ? i + 1 : ""}
                </div>
                {i === 15 && (
                  <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded mb-1 truncate">
                    Property Showing
                  </div>
                )}
                {i === 15 && (
                  <div className="text-xs bg-purple-100 text-purple-800 p-1 rounded truncate">
                    Client Meeting
                  </div>
                )}
                {i === 16 && (
                  <div className="text-xs bg-green-100 text-green-800 p-1 rounded truncate">
                    Open House
                  </div>
                )}
                {i === 17 && (
                  <div className="text-xs bg-yellow-100 text-yellow-800 p-1 rounded truncate">
                    Inspection
                  </div>
                )}
                {i === 18 && (
                  <div className="text-xs bg-red-100 text-red-800 p-1 rounded truncate">
                    Closing
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upcoming Events List */}
          <div>
            <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{event.time}</span>
                      </div>
                      {event.client && (
                        <div className="text-sm mt-2">
                          <span className="font-medium">Client:</span>{" "}
                          {event.client}
                        </div>
                      )}
                      <div className="text-sm mt-1">
                        <span className="font-medium">Notes:</span> {event.notes}
                      </div>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        eventTypeColors[event.type as keyof typeof eventTypeColors]
                      }`}
                    >
                      {event.type.replace("-", " ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <div className="bg-white rounded-xl shadow-sm h-[800px] overflow-hidden flex flex-col">
            <AiAgentChat context="calendar management" />
          </div>
        )}
      </div>
    </div>
  );
} 