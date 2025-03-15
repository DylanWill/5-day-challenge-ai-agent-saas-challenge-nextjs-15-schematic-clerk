# OpenAI Agents Python SDK

The OpenAI Agents SDK enables you to build agentic AI apps in a lightweight, easy-to-use package with very few abstractions. It's a production-ready upgrade of OpenAI's previous experimentation for agents, Swarm.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Installation](#installation)
- [Hello World Example](#hello-world-example)
- [Quickstart](#quickstart)
- [Agents](#agents)
- [Tools](#tools)
- [Handoffs](#handoffs)
- [Guardrails](#guardrails)
- [Tracing](#tracing)
- [Examples](#examples)
- [API Reference](#api-reference)

## Core Concepts

The Agents SDK has a very small set of primitives:

1. **Agents**: LLMs equipped with instructions and tools
2. **Handoffs**: Allow agents to delegate to other agents for specific tasks
3. **Guardrails**: Enable the inputs to agents to be validated

In combination with Python, these primitives are powerful enough to express complex relationships between tools and agents, and allow you to build real-world applications without a steep learning curve. In addition, the SDK comes with built-in **tracing** that lets you visualize and debug your agentic flows, as well as evaluate them and even fine-tune models for your application.

### Why Use the Agents SDK

The SDK has two driving design principles:

1. Enough features to be worth using, but few enough primitives to make it quick to learn.
2. Works great out of the box, but you can customize exactly what happens.

Here are the main features of the SDK:

- **Agent loop**: Built-in agent loop that handles calling tools, sending results to the LLM, and looping until the LLM is done.
- **Python-first**: Use built-in language features to orchestrate and chain agents, rather than needing to learn new abstractions.
- **Handoffs**: A powerful feature to coordinate and delegate between multiple agents.
- **Guardrails**: Run input validations and checks in parallel to your agents, breaking early if the checks fail.
- **Function tools**: Turn any Python function into a tool, with automatic schema generation and Pydantic-powered validation.
- **Tracing**: Built-in tracing that lets you visualize, debug and monitor your workflows, as well as use the OpenAI suite of evaluation, fine-tuning and distillation tools.

## Installation

### Set up your Python environment

```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

### Install the Agents SDK

```bash
pip install openai-agents
```

### Set your OpenAI API key

```bash
# On macOS/Linux
export OPENAI_API_KEY=sk-...

# On Windows (PowerShell)
$env:OPENAI_API_KEY="sk-..."
```

## Hello World Example

```python
from agents import Agent, Runner

agent = Agent(name="Assistant", instructions="You are a helpful assistant")

result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
print(result.final_output)

# Output:
# Code within the code,
# Functions calling themselves,
# Infinite loop's dance.
```

## Quickstart

### Create a project and virtual environment

```bash
mkdir my_project
cd my_project
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install openai-agents
```

### Create your first agent

Agents are defined with instructions, a name, and optional config (such as `model_config`):

```python
from agents import Agent

agent = Agent(
    name="Math Tutor",
    instructions="You provide help with math problems. Explain your reasoning at each step and include examples",
)
```

### Add a few more agents

Additional agents can be defined in the same way. `handoff_descriptions` provide additional context for determining handoff routing:

```python
from agents import Agent

history_tutor_agent = Agent(
    name="History Tutor",
    handoff_description="Specialist agent for historical questions",
    instructions="You provide assistance with historical queries. Explain important events and context clearly.",
)

math_tutor_agent = Agent(
    name="Math Tutor",
    handoff_description="Specialist agent for math questions",
    instructions="You provide help with math problems. Explain your reasoning at each step and include examples",
)
```

### Define your handoffs

Handoffs allow an agent to delegate tasks to another agent:

```python
from agents import Agent, handoff

triage_agent = Agent(
    name="Triage agent", 
    handoffs=[history_tutor_agent, handoff(math_tutor_agent)]
)
```

### Run the agent orchestration

```python
from agents import Runner
import asyncio

async def main():
    result = await Runner.run(
        triage_agent, 
        "I need help understanding the Pythagorean theorem."
    )
    print(result.final_output)
```

## Agents

Agents are the core building block of the SDK. An agent is an LLM equipped with instructions and tools.

```python
from agents import Agent

agent = Agent(
    name="My Agent",
    instructions="You are a helpful assistant that provides information about...",
    tools=[...],  # Optional list of tools
    handoffs=[...],  # Optional list of handoffs to other agents
    model_config={...},  # Optional model configuration
    output_type=...,  # Optional Pydantic model for structured output
)
```

### The Agent Loop

When you call `Runner.run()`, the SDK runs a loop until it gets a final output:

1. The LLM is called, using the model and settings on the agent, and the message history.
2. The LLM returns a response, which may include tool calls.
3. If the response has a final output, the loop ends and returns it.
4. If the response has a handoff, the agent is set to the new agent and the loop continues.
5. Tool calls are processed (if any) and the tool responses are appended to the messages. Then the loop continues.

There is a `max_turns` parameter that you can use to limit the number of times the loop executes.

### Final Output

Final output is the last thing the agent produces in the loop:

1. If you set an `output_type` on the agent, the final output is when the LLM returns something of that type (using structured outputs).
2. If there's no `output_type` (i.e., plain text responses), then the first LLM response without any tool calls or handoffs is considered as the final output.

## Tools

Tools allow agents to interact with external systems or perform specific functions. The Agents SDK makes it easy to turn any Python function into a tool:

```python
from agents import Agent, Runner, function_tool

@function_tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    # In a real implementation, this would call a weather API
    return f"The weather in {city} is sunny."

agent = Agent(
    name="Weather Assistant",
    instructions="You help users find weather information.",
    tools=[get_weather],
)

# Usage
import asyncio

async def main():
    result = await Runner.run(agent, "What's the weather in Tokyo?")
    print(result.final_output)
    # Output: The weather in Tokyo is sunny.

if __name__ == "__main__":
    asyncio.run(main())
```

## Handoffs

Handoffs allow an agent to delegate tasks to another agent. This is particularly useful in scenarios where different agents specialize in distinct areas.

### Basic Handoff Example

```python
from agents import Agent, Runner, handoff
import asyncio

spanish_agent = Agent(
    name="Spanish agent",
    instructions="You only speak Spanish.",
)

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
)

triage_agent = Agent(
    name="Triage agent",
    instructions="Handoff to the appropriate agent based on the language of the request.",
    handoffs=[spanish_agent, english_agent],
)

async def main():
    result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
    print(result.final_output)
    # Output: ¡Hola! Estoy bien, gracias por preguntar. ¿Y tú, cómo estás?

if __name__ == "__main__":
    asyncio.run(main())
```

### Customizing Handoffs

The `handoff()` function lets you customize handoffs:

```python
from agents import Agent, handoff, RunContextWrapper

def on_handoff(ctx: RunContextWrapper[None]):
    print("Handoff called")

agent = Agent(name="My agent")

handoff_obj = handoff(
    agent=agent,
    on_handoff=on_handoff,
    tool_name_override="custom_handoff_tool",
    tool_description_override="Custom description",
)
```

### Handoff Inputs

You can specify data to be provided when a handoff is called:

```python
from pydantic import BaseModel
from agents import Agent, handoff, RunContextWrapper

class EscalationData(BaseModel):
    reason: str

async def on_handoff(ctx: RunContextWrapper[None], input_data: EscalationData):
    print(f"Escalation agent called with reason: {input_data.reason}")

agent = Agent(name="Escalation agent")

handoff_obj = handoff(
    agent=agent,
    on_handoff=on_handoff,
    input_type=EscalationData,
)
```

### Input Filters

Input filters allow you to modify what the new agent sees from the conversation history:

```python
from agents import Agent, handoff
from agents.extensions import handoff_filters

agent = Agent(name="FAQ agent")

handoff_obj = handoff(
    agent=agent,
    input_filter=handoff_filters.remove_all_tools,  # This removes all tools from the history
)
```

### Recommended Prompts

To make sure that LLMs understand handoffs properly:

```python
from agents import Agent
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX

billing_agent = Agent(
    name="Billing agent",
    instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
    <Fill in the rest of your prompt here>.""",
)
```

## Guardrails

Guardrails enable input validation and checks to run in parallel with your agents, breaking early if the checks fail.

## Tracing

The Agents SDK automatically traces your agent runs, making it easy to track and debug the behavior of your agents. Tracing is extensible by design, supporting custom spans and a wide variety of external destinations, including Logfire, AgentOps, and Braintrust.

## Examples

### Function Tool Example

```python
import asyncio
from agents import Agent, Runner, function_tool

@function_tool
def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny."

agent = Agent(
    name="Weather Assistant",
    instructions="You are a helpful agent.",
    tools=[get_weather],
)

async def main():
    result = await Runner.run(agent, input="What's the weather in Tokyo?")
    print(result.final_output)
    # Output: The weather in Tokyo is sunny.

if __name__ == "__main__":
    asyncio.run(main())
```

### Handoffs Example

```python
from agents import Agent, Runner
import asyncio

spanish_agent = Agent(
    name="Spanish agent",
    instructions="You only speak Spanish.",
)

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
)

triage_agent = Agent(
    name="Triage agent",
    instructions="Handoff to the appropriate agent based on the language of the request.",
    handoffs=[spanish_agent, english_agent],
)

async def main():
    result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
    print(result.final_output)
    # Output: ¡Hola! Estoy bien, gracias por preguntar. ¿Y tú, cómo estás?

if __name__ == "__main__":
    asyncio.run(main())
```

## API Reference

For detailed API documentation, visit the [official documentation](https://openai.github.io/openai-agents-python/).

### Key Components

- **Agent**: The main class for creating agents with instructions, tools, and handoffs.
- **Runner**: Used to run agents and manage the agent loop.
- **function_tool**: Decorator to turn Python functions into tools.
- **handoff**: Function to create and customize handoffs between agents.
- **Tracing**: Built-in functionality for debugging and monitoring agent workflows.

## Resources

- [GitHub Repository](https://github.com/openai/openai-agents-python)
- [Official Documentation](https://openai.github.io/openai-agents-python/) 