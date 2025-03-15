import { function_tool } from 'openai-agents';
import { createBaseAgent, runAgent } from './openai-setup';

// Import tools (adjust paths as needed for your project structure)
import { calendarManagement } from '../tools/calendarManagement';
import { documentManagement } from '../tools/documentManagement';
import { emailManagement } from '../tools/emailManagement';
import { marketAnalysis } from '../tools/marketAnalysis';
import { propertyReports } from '../tools/propertyReports';

// Create function tools
const calendarTool = function_tool(calendarManagement);
const documentTool = function_tool(documentManagement);
const emailTool = function_tool(emailManagement);
const marketTool = function_tool(marketAnalysis);
const propertyTool = function_tool(propertyReports);

// All available tools
export const allTools = [
  calendarTool,
  documentTool,
  emailTool,
  marketTool,
  propertyTool
];

// Tool descriptions for documentation
export const toolDescriptions = {
  calendarManagement: 'Manage calendar events, appointments, and schedules',
  documentManagement: 'Handle document creation, editing, and organization',
  emailManagement: 'Compose, send, and manage email communications',
  marketAnalysis: 'Analyze real estate market trends and data',
  propertyReports: 'Generate and manage property reports and listings'
};

// Create specialized agents for specific domains
export const calendarAgent = createBaseAgent(
  'Calendar Assistant',
  'You are a specialized assistant for managing calendars and scheduling.',
  [calendarTool]
);

export const documentAgent = createBaseAgent(
  'Document Assistant',
  'You are a specialized assistant for document management.',
  [documentTool]
);

export const emailAgent = createBaseAgent(
  'Email Assistant',
  'You are a specialized assistant for email communication.',
  [emailTool]
);

export const marketAgent = createBaseAgent(
  'Market Analysis Assistant',
  'You are a specialized assistant for real estate market analysis.',
  [marketTool]
);

export const propertyAgent = createBaseAgent(
  'Property Reports Assistant',
  'You are a specialized assistant for property reports and listings.',
  [propertyTool]
);

// Create main agent with all tools
export const mainAgent = createBaseAgent(
  'Real Estate Assistant',
  'You are a comprehensive real estate assistant. Use the appropriate tools to help with calendar management, document handling, email communication, market analysis, and property reports.',
  allTools
);

// Function to process a query with the appropriate agent
export async function processQuery(query: string, agentType?: string) {
  // Select the appropriate agent based on the type
  let agent = mainAgent;
  
  switch (agentType) {
    case 'calendar':
      agent = calendarAgent;
      break;
    case 'document':
      agent = documentAgent;
      break;
    case 'email':
      agent = emailAgent;
      break;
    case 'market':
      agent = marketAgent;
      break;
    case 'property':
      agent = propertyAgent;
      break;
    default:
      // Use main agent with all tools
      break;
  }
  
  // Process the query with the selected agent
  return await runAgent(agent, query);
}

// Export default function for easy access
export default processQuery; 