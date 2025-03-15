import { Agent, Runner, function_tool } from 'openai-agents';
import { calendarManagement } from '../tools/calendarManagement';
import { documentManagement } from '../tools/documentManagement';
import { emailManagement } from '../tools/emailManagement';
import { marketAnalysis } from '../tools/marketAnalysis';
import { propertyReports } from '../tools/propertyReports';

// Configuration for OpenAI API
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-placeholder';

// Wrap tool functions with function_tool decorator
const calendarTool = function_tool(calendarManagement);
const documentTool = function_tool(documentManagement);
const emailTool = function_tool(emailManagement);
const marketTool = function_tool(marketAnalysis);
const propertyTool = function_tool(propertyReports);

// Create the main agent with GPT-4o Mini model configuration
const realEstateAgent = new Agent({
  name: "Real Estate Assistant",
  instructions: "You are a helpful real estate assistant. Use the available tools to help with calendar management, document handling, email communication, market analysis, and property reports.",
  tools: [calendarTool, documentTool, emailTool, marketTool, propertyTool],
  model_config: {
    model: "gpt-4o-mini", // Specify GPT-4o Mini model
    temperature: 0.7,
    max_tokens: 1000
  }
});

// Function to process user queries
export async function processUserQuery(query: string) {
  try {
    // Run the agent with the user's query
    const result = await Runner.run(realEstateAgent, query);
    return result.final_output;
  } catch (error) {
    console.error("Error processing query:", error);
    return "Sorry, there was an error processing your request.";
  }
}

// Function to initialize the OpenAI API
export function initializeOpenAI() {
  // Set the API key for the OpenAI SDK
  process.env.OPENAI_API_KEY = OPENAI_API_KEY;
  console.log("OpenAI API initialized");
}

// Export the agent for use in other parts of the application
export { realEstateAgent }; 