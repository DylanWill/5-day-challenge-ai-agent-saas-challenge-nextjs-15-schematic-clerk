"use client";

import { useState, useEffect } from "react";
import {
  Archive,
  Clock,
  Inbox,
  Plus,
  Star,
  Tag,
  Trash,
  Loader2,
} from "lucide-react";
import { fetchLabels, createGmailLabel } from "@/actions/gmail";

interface EmailSidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedPriority: string | null;
  setSelectedPriority: (priority: string | null) => void;
  unreadCount: number;
  starredCount: number;
}

export default function EmailSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  unreadCount,
  starredCount,
}: EmailSidebarProps) {
  const [labels, setLabels] = useState<any[]>([]);
  const [isLoadingLabels, setIsLoadingLabels] = useState(true);
  const [newLabelName, setNewLabelName] = useState("");
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [showNewLabelInput, setShowNewLabelInput] = useState(false);

  // Fetch labels when the component mounts
  useEffect(() => {
    async function getLabels() {
      setIsLoadingLabels(true);
      
      try {
        const result = await fetchLabels();
        
        if (result.success) {
          // Filter out system labels
          const userLabels = result.labels.filter((label: any) => 
            !label.id.startsWith('CATEGORY_') && 
            !['INBOX', 'SENT', 'TRASH', 'SPAM', 'DRAFT', 'STARRED', 'UNREAD'].includes(label.id)
          );
          
          setLabels(userLabels);
        }
      } catch (error) {
        console.error('Error fetching labels:', error);
      } finally {
        setIsLoadingLabels(false);
      }
    }
    
    getLabels();
  }, []);

  // Create a new label
  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    
    setIsCreatingLabel(true);
    
    try {
      const result = await createGmailLabel(newLabelName);
      
      if (result.success) {
        setLabels((prev) => [...prev, result.label]);
        setNewLabelName("");
        setShowNewLabelInput(false);
      }
    } catch (error) {
      console.error('Error creating label:', error);
    } finally {
      setIsCreatingLabel(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="space-y-1 mb-6">
        <button className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium">
          <Inbox className="w-4 h-4" />
          <span>Inbox</span>
          <span className="ml-auto bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
            {unreadCount}
          </span>
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
          <Star className="w-4 h-4" />
          <span>Starred</span>
          <span className="ml-auto bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
            {starredCount}
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
        <div className="flex justify-between items-center mb-2 px-3">
          <h3 className="font-medium text-sm text-gray-500">CATEGORIES</h3>
          {!showNewLabelInput && (
            <button 
              onClick={() => setShowNewLabelInput(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* New label input */}
        {showNewLabelInput && (
          <div className="px-3 mb-2">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="New label name"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleCreateLabel}
                disabled={isCreatingLabel || !newLabelName.trim()}
                className="px-2 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
              >
                {isCreatingLabel ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
              </button>
            </div>
            <button
              onClick={() => {
                setShowNewLabelInput(false);
                setNewLabelName("");
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
        
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
          
          {/* User labels */}
          {isLoadingLabels ? (
            <div className="flex justify-center py-2">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          ) : (
            labels.map((label) => (
              <button
                key={label.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === label.name ? null : label.name
                  )
                }
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  selectedCategory === label.name
                    ? "bg-blue-50 text-blue-800"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>{label.name}</span>
              </button>
            ))
          )}
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
  );
} 