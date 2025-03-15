# OpenAI Agents SDK Setup

This document provides instructions for setting up and using the OpenAI Agents SDK in the Real Estate AI Assistant application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Tool Integration](#tool-integration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Install the required dependencies:

```bash
npm install
# or
yarn install
```

2. Create a `.env` file in the root directory with your OpenAI API key:

```
OPENAI_API_KEY=your-api-key-here
```

## Configuration

The OpenAI Agents SDK is configured to use the GPT-4o Mini model by default. You can modify the configuration in the `config/openai.ts` file.

### Model Configuration

The default model is set to `gpt-4o-mini`. You can change this in the `config/openai.ts` file:

```typescript
export const DEFAULT_MODEL = 'gpt-4o-mini';
```

### API Configuration

The API configuration is also defined in the `config/openai.ts` file:

```typescript
export const API_CONFIG = {
  baseURL: 'https://api.openai.com/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
};
```

## Usage

### Initializing the SDK

Before using the OpenAI Agents SDK, you need to initialize it with your API key:

```typescript
import { initializeOpenAI } from './lib/openai-setup';

// Initialize with API key from environment variables
initializeOpenAI();

// Or initialize with a specific API key
initializeOpenAI('your-api-key-here');
```

### Processing Queries

You can process user queries using the `processQuery` function:

```typescript
import processQuery from './lib/tool-integration';

// Process a query with the main agent (all tools)
const response = await processQuery('What properties are available in downtown?');

// Process a query with a specific agent type
const calendarResponse = await processQuery('Schedule a meeting for tomorrow at 2 PM', 'calendar');
```

### Using Specialized Agents

The application includes specialized agents for different domains:

- `calendarAgent`: For calendar management
- `documentAgent`: For document management
- `emailAgent`: For email communication
- `marketAgent`: For market analysis
- `propertyAgent`: For property reports

You can use these agents directly:

```typescript
import { runAgent } from './lib/openai-setup';
import { calendarAgent } from './lib/tool-integration';

const response = await runAgent(calendarAgent, 'Schedule a meeting for tomorrow');
```

## Tool Integration

The OpenAI Agents SDK is integrated with the following tools:

1. **Calendar Management**: Manage calendar events, appointments, and schedules
2. **Document Management**: Handle document creation, editing, and organization
3. **Email Management**: Compose, send, and manage email communications
4. **Market Analysis**: Analyze real estate market trends and data
5. **Property Reports**: Generate and manage property reports and listings

Each tool is wrapped with the `function_tool` decorator to make it compatible with the OpenAI Agents SDK.

### Adding New Tools

To add a new tool:

1. Create your tool function
2. Wrap it with the `function_tool` decorator
3. Add it to the appropriate agent

Example:

```typescript
import { function_tool } from 'openai-agents';
import { createBaseAgent } from './lib/openai-setup';

// Create your tool function
function myNewTool(param1: string, param2: number): string {
  // Tool implementation
  return `Processed ${param1} with value ${param2}`;
}

// Wrap it with function_tool
const wrappedTool = function_tool(myNewTool);

// Create an agent with the new tool
const myAgent = createBaseAgent(
  'My Agent',
  'You are an agent with a custom tool.',
  [wrappedTool]
);
```

## Troubleshooting

### API Key Issues

If you encounter issues with the API key:

1. Make sure your API key is correctly set in the `.env` file
2. Check that the API key is being properly loaded with `process.env.OPENAI_API_KEY`
3. Verify that your API key has the necessary permissions for the OpenAI API

### Model Availability

If you encounter issues with the model:

1. Verify that the model specified in the configuration is available in your OpenAI account
2. Check the OpenAI documentation for any changes to model availability or naming

### Tool Execution Errors

If tools are not executing correctly:

1. Check that the tool functions are properly implemented and returning the expected values
2. Verify that the tools are correctly wrapped with the `function_tool` decorator
3. Check the console for any error messages during tool execution

For additional help, refer to the [OpenAI Agents SDK documentation](https://openai.github.io/openai-agents-python/). 