import { Agent, Runner } from 'openai-agents';
import openaiConfig from '../config/openai';

// Initialize OpenAI API
export function initializeOpenAI(apiKey?: string) {
  // Set API key from parameter or config
  const key = apiKey || openaiConfig.apiKey;
  
  if (!key) {
    throw new Error('OpenAI API key is required. Please provide a valid API key.');
  }
  
  // Set environment variable for OpenAI SDK
  process.env.OPENAI_API_KEY = key;
  
  console.log('OpenAI API initialized successfully');
  return true;
}

// Create a base agent with default configuration
export function createBaseAgent(name: string, instructions: string, tools: any[] = []) {
  return new Agent({
    name,
    instructions,
    tools,
    model_config: {
      model: openaiConfig.model,
      ...openaiConfig.modelConfig
    }
  });
}

// Run an agent with a query
export async function runAgent(agent: any, query: string) {
  try {
    const result = await Runner.run(agent, query);
    return result.final_output;
  } catch (error) {
    console.error('Error running agent:', error);
    throw error;
  }
}

// Run an agent synchronously
export function runAgentSync(agent: any, query: string) {
  return Runner.run_sync(agent, query).final_output;
}

// Export default setup function
export default function setupOpenAI(apiKey?: string) {
  initializeOpenAI(apiKey);
  
  return {
    createAgent: createBaseAgent,
    runAgent,
    runAgentSync
  };
} 