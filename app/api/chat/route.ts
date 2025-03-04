import { NextResponse } from "next/server";
import { createAnthropic } from "@anthropic-ai/sdk";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { marketAnalysisTool } from "@/tools/marketAnalysis";
import { scheduleAppointmentTool } from "@/tools/calendarManagement";
import { draftEmailTool } from "@/tools/emailManagement";
import { propertyReportTool } from "@/tools/propertyReports";
import {
  documentProcessingTool,
  searchClientFolderTool,
  sendDocumentNotificationTool,
  registerWebhookTool,
  createAutomationRuleTool,
} from "@/tools/documentManagement";

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

    const anthropic = createAnthropic({
      apiKey: process.env.CLAUDE_API_KEY || "",
    });

    const systemMessage = `You are an AI assistant for real estate agents. You help with calendar management, email organization, market analysis, client report generation, and document management. You're friendly, professional, and use emojis occasionally to be engaging. 

Current context: ${context || "general assistance"}

Today's date is ${new Date().toLocaleDateString()}.`;

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0.7,
      system: systemMessage,
      messages,
      tools: [
        {
          name: "getMarketTrends",
          description: "Get real estate market trends for a specific area",
          input_schema: marketAnalysisTool.schema,
        },
        {
          name: "scheduleAppointment",
          description: "Schedule an appointment on the agent's calendar",
          input_schema: scheduleAppointmentTool.schema,
        },
        {
          name: "draftEmail",
          description: "Draft an email for a client",
          input_schema: draftEmailTool.schema,
        },
        {
          name: "generatePropertyReport",
          description: "Generate a comparative market analysis report for a property",
          input_schema: propertyReportTool.schema,
        },
        {
          name: "processRealEstateDocument",
          description: "Process a real estate document using OCR, organize it in Google Drive, and notify the client",
          input_schema: documentProcessingTool.schema,
        },
        {
          name: "searchClientFolder",
          description: "Search for a client's folder in Google Drive",
          input_schema: searchClientFolderTool.schema,
        },
        {
          name: "sendDocumentNotification",
          description: "Send an email notification about uploaded documents to a client",
          input_schema: sendDocumentNotificationTool.schema,
        },
        {
          type: "function",
          function: {
            name: "registerDocumentWebhook",
            description: "Register a webhook to be called when document events occur",
            parameters: registerWebhookTool.parameters,
          },
        },
        {
          type: "function",
          function: {
            name: "createDocumentAutomationRule",
            description: "Create an automation rule that triggers actions when document events occur",
            parameters: createAutomationRuleTool.parameters,
          },
        },
      ],
      tool_choice: "auto",
    });

    const toolCalls = response.content.filter(
      (content) => content.type === "tool_call"
    );

    const streamText = async () => {
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(
            JSON.stringify({
              type: "text",
              text: "",
            })
          );

          for (const toolCall of toolCalls) {
            if (toolCall.type !== "tool_call") continue;

            let result;
            try {
              if (toolCall.name === "getMarketTrends") {
                result = await marketAnalysisTool.execute(toolCall.input);
              } else if (toolCall.name === "scheduleAppointment") {
                result = await scheduleAppointmentTool.execute(toolCall.input);
              } else if (toolCall.name === "draftEmail") {
                result = await draftEmailTool.execute(toolCall.input);
              } else if (toolCall.name === "generatePropertyReport") {
                result = await propertyReportTool.execute(toolCall.input);
              } else if (toolCall.name === "processRealEstateDocument") {
                result = await documentProcessingTool.execute(toolCall.input);
              } else if (toolCall.name === "searchClientFolder") {
                result = await searchClientFolderTool.execute(toolCall.input);
              } else if (toolCall.name === "sendDocumentNotification") {
                result = await sendDocumentNotificationTool.execute(toolCall.input);
              } else if (toolCall.function.name === "registerDocumentWebhook") {
                const args = JSON.parse(toolCall.function.arguments);
                result = await registerWebhookTool.execute(args);
              } else if (toolCall.function.name === "createDocumentAutomationRule") {
                const args = JSON.parse(toolCall.function.arguments);
                result = await createAutomationRuleTool.execute(args);
              }
            } catch (error) {
              console.error(`Error executing tool ${toolCall.name}:`, error);
              result = {
                error: error instanceof Error ? error.message : "Unknown error",
              };
            }

            controller.enqueue(
              JSON.stringify({
                type: "tool-invocation",
                toolInvocation: {
                  toolCallId: toolCall.id,
                  toolName: toolCall.name,
                  result,
                },
              })
            );
          }

          for (const content of response.content) {
            if (content.type === "text") {
              controller.enqueue(
                JSON.stringify({
                  type: "text",
                  text: content.text,
                })
              );
            }
          }

          controller.close();
        },
      });

      return new Response(stream);
    };

    return streamText();
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
