// Example of using OpenAI Agents SDK with tools

import setupOpenAI from '../lib/openai-setup';
import processQuery from '../lib/tool-integration';
import { mainAgent, calendarAgent, documentAgent, emailAgent, marketAgent, propertyAgent } from '../lib/tool-integration';
import { runAgent } from '../lib/openai-setup';

// Initialize OpenAI (replace with your actual API key when running)
const openai = setupOpenAI('your-api-key-here');

// Example async function to demonstrate usage
async function runExamples() {
  try {
    console.log('Running OpenAI Agents SDK examples...\n');

    // Example 1: Using the main agent with all tools
    console.log('Example 1: Main agent with all tools');
    const mainResponse = await processQuery('What are the current market trends for residential properties in downtown?');
    console.log('Response:', mainResponse);
    console.log('---\n');

    // Example 2: Using a specialized calendar agent
    console.log('Example 2: Calendar agent');
    const calendarResponse = await runAgent(calendarAgent, 'Schedule a property viewing for tomorrow at 3 PM');
    console.log('Response:', calendarResponse);
    console.log('---\n');

    // Example 3: Using a specialized document agent
    console.log('Example 3: Document agent');
    const documentResponse = await runAgent(documentAgent, 'Create a sales contract template for a residential property');
    console.log('Response:', documentResponse);
    console.log('---\n');

    // Example 4: Using a specialized email agent
    console.log('Example 4: Email agent');
    const emailResponse = await runAgent(emailAgent, 'Draft an email to a client about their upcoming property closing');
    console.log('Response:', emailResponse);
    console.log('---\n');

    // Example 5: Using a specialized market analysis agent
    console.log('Example 5: Market analysis agent');
    const marketResponse = await runAgent(marketAgent, 'Analyze the current market conditions for commercial properties');
    console.log('Response:', marketResponse);
    console.log('---\n');

    // Example 6: Using a specialized property reports agent
    console.log('Example 6: Property reports agent');
    const propertyResponse = await runAgent(propertyAgent, 'Generate a property valuation report for 123 Main St');
    console.log('Response:', propertyResponse);
    console.log('---\n');

    console.log('All examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run the examples
if (require.main === module) {
  runExamples().catch(console.error);
}

// Export for use in other files
export { runExamples }; 