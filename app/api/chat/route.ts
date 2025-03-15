import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { Agent, Runner, function_tool } from 'openai-agents';
import { z } from "zod";
import { 
  marketAnalysisTool, 
  propertyDetailsTool, 
  propertyFloorPlanTool,
  propertyExtendedSearchTool,
  propertyByPolygonTool,
  rentEstimateTool,
  locationSuggestionsTool,
  redfinRentalPropertiesTool,
  redfinPropertiesForSaleTool,
  redfinPropertyDetailsTool,
  attomPropertyDetailsTool,
  attomPropertyValuationTool,
  attomSalesHistoryTool
} from "@/tools/marketAnalysis";
import { scheduleAppointmentTool } from "@/tools/calendarManagement";
import { draftEmailTool, sendEmailTool } from "@/tools/emailManagement";
import { propertyReportTool } from "@/tools/propertyReports";
import {
  documentProcessingTool,
  searchClientFolderTool,
  sendDocumentNotificationTool,
  registerWebhookTool,
  createAutomationRuleTool,
} from "@/tools/documentManagement";

// OpenAI model configuration
const MODEL_CONFIG = {
  MODEL_NAME: "gpt-4o-mini", // Using GPT-4o Mini as specified
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7
};

// Wrap tool functions with function_tool decorator
const wrappedTools = {
  getMarketTrends: function_tool(marketAnalysisTool.execute),
  getPropertyDetails: function_tool(propertyDetailsTool.execute),
  getPropertyFloorPlan: function_tool(propertyFloorPlanTool.execute),
  getPropertyExtendedSearch: function_tool(propertyExtendedSearchTool.execute),
  getPropertyByPolygon: function_tool(propertyByPolygonTool.execute),
  getRentEstimate: function_tool(rentEstimateTool.execute),
  getLocationSuggestions: function_tool(locationSuggestionsTool.execute),
  getRedfinRentalProperties: function_tool(redfinRentalPropertiesTool.execute),
  getRedfinPropertiesForSale: function_tool(redfinPropertiesForSaleTool.execute),
  getRedfinPropertyDetails: function_tool(redfinPropertyDetailsTool.execute),
  getAttomPropertyDetails: function_tool(attomPropertyDetailsTool.execute),
  getAttomPropertyValuation: function_tool(attomPropertyValuationTool.execute),
  getAttomSalesHistory: function_tool(attomSalesHistoryTool.execute),
  scheduleAppointment: function_tool(scheduleAppointmentTool.execute),
  draftEmail: function_tool(draftEmailTool.execute),
  sendEmail: function_tool(sendEmailTool.execute),
  generatePropertyReport: function_tool(propertyReportTool.execute),
  processRealEstateDocument: function_tool(documentProcessingTool.execute),
  searchClientFolder: function_tool(searchClientFolderTool.execute),
  sendDocumentNotification: function_tool(sendDocumentNotificationTool.execute),
  registerDocumentWebhook: function_tool(registerWebhookTool.execute),
  createDocumentAutomationRule: function_tool(createAutomationRuleTool.execute)
};

// Initialize OpenAI API
function initializeOpenAI() {
  // Set API key from environment variable
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  
  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  return true;
}

// Create real estate agent with all tools
function createRealEstateAgent(context: string) {
  const systemMessage = `You are an AI assistant for real estate agents. You help with calendar management, email organization, market analysis, client report generation, and document management. You can also fetch property details, floor plans, and search for properties on Zillow, search for properties on Redfin, as well as comprehensive property data, valuations, and sales history from ATTOM Data. You're friendly, professional, and use emojis occasionally to be engaging. 

Current context: ${context || "general assistance"}

Today's date is ${new Date().toLocaleDateString()}.`;

  return new Agent({
    name: "Real Estate Assistant",
    instructions: systemMessage,
    tools: Object.values(wrappedTools),
    model_config: {
      model: MODEL_CONFIG.MODEL_NAME,
      temperature: MODEL_CONFIG.TEMPERATURE,
      max_tokens: MODEL_CONFIG.MAX_TOKENS
    }
  });
}

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to use the chat API" },
        { status: 401 }
      );
    }

    // Initialize OpenAI
    initializeOpenAI();

    // Create agent with context
    const realEstateAgent = createRealEstateAgent(context);

    // Format messages for OpenAI Agents SDK
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    // Process the query with the agent
    const result = await Runner.run(realEstateAgent, formattedMessages);

    // Return the response
    return NextResponse.json({
      response: result.final_output,
      id: Date.now().toString(),
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during the chat request" },
      { status: 500 }
    );
  }
}
