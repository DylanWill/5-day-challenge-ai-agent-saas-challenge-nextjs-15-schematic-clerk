"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  Search,
  Filter,
  FolderOpen,
  Mail,
  Brain,
  FileCheck,
  AlertCircle,
  Loader2,
  X,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import AiAgentChat from "@/components/AiAgentChat";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flags";

// Mock document types
const documentTypes = [
  "Purchase Agreement",
  "Listing Agreement",
  "Disclosure Form",
  "Inspection Report",
  "Closing Documents",
  "Mortgage Documents",
  "Title Documents",
  "Other",
];

// Mock recent documents
const mockRecentDocuments = [
  {
    id: 1,
    name: "Purchase Agreement - 123 Main St.pdf",
    client: "John Smith",
    uploadDate: "June 15, 2023",
    type: "Purchase Agreement",
    status: "Processed",
    folderUrl: "https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i",
  },
  {
    id: 2,
    name: "Disclosure Form - 456 Oak Ave.pdf",
    client: "Sarah Johnson",
    uploadDate: "June 10, 2023",
    type: "Disclosure Form",
    status: "Processed",
    folderUrl: "https://drive.google.com/drive/folders/2b3c4d5e6f7g8h9i1a",
  },
  {
    id: 3,
    name: "Inspection Report - 789 Pine St.pdf",
    client: "Michael Brown",
    uploadDate: "June 8, 2023",
    type: "Inspection Report",
    status: "Processed",
    folderUrl: "https://drive.google.com/drive/folders/3c4d5e6f7g8h9i1a2b",
  },
  {
    id: 4,
    name: "Listing Agreement - 321 Elm St.pdf",
    client: "David Wilson",
    uploadDate: "June 5, 2023",
    type: "Listing Agreement",
    status: "Processed",
    folderUrl: "https://drive.google.com/drive/folders/4d5e6f7g8h9i1a2b3c",
  },
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<any | null>(null);
  const [showUploadDetails, setShowUploadDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDocumentManagementEnabled = useSchematicFlag(
    FeatureFlag.DOCUMENT_MANAGEMENT
  );

  // Filter documents based on search term and type
  const filteredDocuments = mockRecentDocuments.filter(
    (doc) =>
      (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedType || doc.type === selectedType)
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Simulate file upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setShowUploadDetails(true);
      
      // Mock response from document processing
      setUploadedDocument({
        name: file.name,
        type: "Purchase Agreement",
        client: "John Smith",
        clientEmail: "john.smith@example.com",
        propertyAddress: "123 Main St, Anytown, USA",
        folderUrl: "https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i",
        newFolderCreated: true,
        emailSent: true,
        confidence: 0.92,
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 3000);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    
    const file = e.dataTransfer.files[0];
    setIsUploading(true);
    
    // Simulate file upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setShowUploadDetails(true);
      
      // Mock response from document processing
      setUploadedDocument({
        name: file.name,
        type: "Purchase Agreement",
        client: "John Smith",
        clientEmail: "john.smith@example.com",
        propertyAddress: "123 Main St, Anytown, USA",
        folderUrl: "https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i",
        newFolderCreated: true,
        emailSent: true,
        confidence: 0.92,
      });
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-2">
            Upload, organize, and share real estate documents with clients
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
          >
            <Brain className="w-4 h-4" />
            {showAIAssistant ? "Hide AI Assistant" : "AI Document Assistant"}
          </button>
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
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-sm text-gray-500 mb-2 px-3">
                DOCUMENT TYPES
              </h3>
              <div className="space-y-1">
                {documentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setSelectedType(selectedType === type ? null : type)
                    }
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      selectedType === type
                        ? "bg-blue-50 text-blue-800"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2 px-3">
                QUICK ACTIONS
              </h3>
              <div className="space-y-1">
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700"
                  onClick={() => window.open("https://drive.google.com", "_blank")}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Open Google Drive</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>Email Selected Documents</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!showAIAssistant ? (
          <div className="lg:col-span-3">
            {/* Upload Area */}
            <div 
              className={`bg-white rounded-xl shadow-sm p-6 mb-8 ${!isDocumentManagementEnabled ? 'opacity-60' : ''}`}
            >
              <h2 className="text-xl font-semibold mb-6">Upload Documents</h2>
              
              {showUploadDetails && uploadedDocument ? (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-green-100 p-1 rounded-full">
                        <FileCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800">Document Processed Successfully</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {uploadedDocument.name} was processed and uploaded to Google Drive
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowUploadDetails(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document Type:</span>
                      <span className="font-medium">{uploadedDocument.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">{uploadedDocument.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property:</span>
                      <span className="font-medium">{uploadedDocument.propertyAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">OCR Confidence:</span>
                      <span className="font-medium">{uploadedDocument.confidence * 100}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Folder Created:</span>
                      <span className="font-medium">{uploadedDocument.newFolderCreated ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email Notification:</span>
                      <span className="font-medium">{uploadedDocument.emailSent ? "Sent" : "Not Sent"}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <a 
                      href={uploadedDocument.folderUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Open in Google Drive
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    <button 
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      onClick={() => {
                        setShowUploadDetails(false);
                        setUploadSuccess(null);
                        setUploadedDocument(null);
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Another Document
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${isUploading ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors`}
                  onDragOver={handleDragOver}
                  onDrop={isDocumentManagementEnabled ? handleDrop : undefined}
                  onClick={() => isDocumentManagementEnabled && fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">Processing Document</h3>
                      <p className="text-sm text-gray-500 mt-2">
                        Analyzing document with OCR and organizing in Google Drive...
                      </p>
                    </div>
                  ) : uploadSuccess === false ? (
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">Upload Failed</h3>
                      <p className="text-sm text-gray-500 mt-2">
                        There was an error processing your document. Please try again.
                      </p>
                      <button 
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => setUploadSuccess(null)}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className={`w-12 h-12 ${isDocumentManagementEnabled ? 'text-blue-500' : 'text-gray-400'} mb-4`} />
                      <h3 className={`text-lg font-medium ${isDocumentManagementEnabled ? 'text-gray-700' : 'text-gray-500'}`}>
                        {isDocumentManagementEnabled ? 'Drag & Drop or Click to Upload' : 'Document Management Upgrade Required'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {isDocumentManagementEnabled 
                          ? 'Supported formats: PDF, DOCX, JPG, PNG' 
                          : 'Upgrade your plan to access document management features'}
                      </p>
                      {!isDocumentManagementEnabled && (
                        <Link 
                          href="/manage-plan" 
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Upgrade Plan
                        </Link>
                      )}
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={!isDocumentManagementEnabled || isUploading}
                  />
                </div>
              )}
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Documents</h2>
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          {doc.name}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1">
                          Client: {doc.client}
                        </div>
                        <div className="text-sm text-gray-500">
                          Uploaded: {doc.uploadDate}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {doc.status}
                        </span>
                        <a 
                          href={doc.folderUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2 flex items-center"
                        >
                          <FolderOpen className="w-3 h-3 mr-1" />
                          View in Drive
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </button>
                      <button className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors flex items-center gap-1">
                        <Search className="w-3 h-3" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm h-[800px] overflow-hidden flex flex-col">
            <AiAgentChat context="document management" />
          </div>
        )}
      </div>
    </div>
  );
} 