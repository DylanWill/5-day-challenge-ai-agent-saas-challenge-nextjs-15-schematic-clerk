// OpenAI API Configuration

// Default model configuration
export const DEFAULT_MODEL = 'gpt-4o-mini';

// Model configurations
export const MODEL_CONFIGS = {
  'gpt-4o-mini': {
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  },
  'gpt-4o': {
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  }
};

// API configuration
export const API_CONFIG = {
  baseURL: 'https://api.openai.com/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
};

// Function to get API key from environment
export function getApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not found in environment variables');
    return '';
  }
  return apiKey;
}

// Function to get model configuration
export function getModelConfig(model: string = DEFAULT_MODEL) {
  return MODEL_CONFIGS[model] || MODEL_CONFIGS[DEFAULT_MODEL];
}

// Export default configuration
export default {
  apiKey: getApiKey(),
  model: DEFAULT_MODEL,
  modelConfig: getModelConfig(),
  apiConfig: API_CONFIG
}; 