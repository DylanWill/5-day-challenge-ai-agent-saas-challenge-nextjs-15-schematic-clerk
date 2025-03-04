import { z } from "zod";
import { tool } from "ai";

// Mock function to schedule an appointment
async function scheduleAppointment(
  title: string,
  date: string,
  startTime: string,
  endTime: string,
  client: string,
  location?: string,
  notes?: string
) {
  // In a real implementation, this would call a calendar API
  console.log(`Scheduling appointment: ${title} on ${date} at ${startTime}`);
  
  // Mock response
  return {
    appointmentId: "appt_" + Date.now(),
    title,
    date,
    startTime,
    endTime,
    client,
    location: location || "Office",
    notes: notes || "",
    status: "confirmed",
    timestamp: new Date().toISOString(),
  };
}

// Mock function to check for scheduling conflicts
async function checkForConflicts(date: string, startTime: string, endTime: string) {
  // In a real implementation, this would check a calendar API for conflicts
  console.log(`Checking for conflicts on ${date} between ${startTime} and ${endTime}`);
  
  // Mock response - randomly return conflicts or not
  const hasConflicts = Math.random() > 0.8;
  
  if (hasConflicts) {
    return {
      hasConflicts: true,
      conflicts: [
        {
          appointmentId: "existing_appt_123",
          title: "Existing Client Meeting",
          startTime: startTime,
          endTime: endTime,
          client: "Jane Doe",
        },
      ],
    };
  } else {
    return {
      hasConflicts: false,
      conflicts: [],
    };
  }
}

// AI Tool for scheduling appointments
export const scheduleAppointmentTool = tool({
  name: "scheduleAppointment",
  description: "Schedule an appointment on the agent's calendar",
  parameters: z.object({
    title: z.string().describe("Title of the appointment"),
    date: z.string().describe("Date of the appointment (YYYY-MM-DD format)"),
    startTime: z.string().describe("Start time of the appointment (HH:MM format)"),
    endTime: z.string().describe("End time of the appointment (HH:MM format)"),
    client: z.string().describe("Name of the client"),
    location: z.string().optional().describe("Optional location of the appointment"),
    notes: z.string().optional().describe("Optional notes about the appointment"),
  }),
  execute: async ({ title, date, startTime, endTime, client, location, notes }) => {
    try {
      // Check for conflicts first
      const conflictCheck = await checkForConflicts(date, startTime, endTime);
      
      if (conflictCheck.hasConflicts) {
        return {
          success: false,
          message: "There is a scheduling conflict with an existing appointment.",
          conflicts: conflictCheck.conflicts,
        };
      }
      
      // Schedule the appointment
      const appointment = await scheduleAppointment(
        title,
        date,
        startTime,
        endTime,
        client,
        location,
        notes
      );
      
      return {
        success: true,
        appointment,
      };
    } catch (error) {
      console.error("Error in schedule appointment tool:", error);
      throw new Error("Failed to schedule appointment. Please try again or contact support.");
    }
  },
}); 