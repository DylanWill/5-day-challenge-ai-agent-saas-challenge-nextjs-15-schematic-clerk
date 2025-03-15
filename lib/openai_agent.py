import os
from agents import Agent, Runner, function_tool
import asyncio

# Import tool functions (assuming these are Python functions in your project)
# You'll need to adjust these imports based on your actual project structure
from tools.calendar_management import manage_calendar
from tools.document_management import manage_documents
from tools.email_management import manage_emails
from tools.market_analysis import analyze_market
from tools.property_reports import generate_reports

# Set up OpenAI API key
def setup_openai_api(api_key=None):
    """Initialize the OpenAI API with the provided key or from environment variable"""
    if api_key:
        os.environ["OPENAI_API_KEY"] = api_key
    elif "OPENAI_API_KEY" not in os.environ:
        raise ValueError("OpenAI API key must be provided or set as OPENAI_API_KEY environment variable")
    
    print("OpenAI API initialized successfully")

# Wrap tool functions with function_tool decorator
calendar_tool = function_tool(manage_calendar)
document_tool = function_tool(manage_documents)
email_tool = function_tool(manage_emails)
market_tool = function_tool(analyze_market)
property_tool = function_tool(generate_reports)

# Create the main agent with GPT-4o Mini model configuration
real_estate_agent = Agent(
    name="Real Estate Assistant",
    instructions="You are a helpful real estate assistant. Use the available tools to help with calendar management, document handling, email communication, market analysis, and property reports.",
    tools=[calendar_tool, document_tool, email_tool, market_tool, property_tool],
    model_config={
        "model": "gpt-4o-mini",  # Specify GPT-4o Mini model
        "temperature": 0.7,
        "max_tokens": 1000
    }
)

# Function to process user queries
async def process_query(query):
    """Process a user query using the real estate agent"""
    try:
        result = await Runner.run(real_estate_agent, query)
        return result.final_output
    except Exception as e:
        print(f"Error processing query: {e}")
        return f"Sorry, there was an error processing your request: {str(e)}"

# Synchronous version for easier integration
def process_query_sync(query):
    """Synchronous wrapper for process_query"""
    return asyncio.run(process_query(query))

# Example usage
if __name__ == "__main__":
    # Example: Set up API key
    setup_openai_api("your-api-key-here")
    
    # Example: Process a query
    response = process_query_sync("What's my schedule for tomorrow?")
    print(response) 