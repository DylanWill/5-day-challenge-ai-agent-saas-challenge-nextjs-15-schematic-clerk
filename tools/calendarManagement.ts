import { z } from "zod";
import { tool } from "ai";

// This would be a real API call to Google Calendar in a production environment
async function scheduleAppointment(
  title: string,
  date: string,
  startTime: string,
  endTime: string,
  client: string,
  location?: string,
  notes?: string
) {
  // Mock data for demonstration purposes
  return {
    appointmentId: "apt-" + Math.random().toString(36).substring(2, 10),
    title,
    date,
    startTime,
    endTime,
    client,
    location: location || "TBD",
    notes: notes || "",
    status: "scheduled",
    timestamp: new Date().toISOString(),
  };
}

// This would check for conflicts in a real implementation
async function checkForConflicts(date: string, startTime: string, endTime: string) {
  // Mock data for demonstration purposes
  return {
    hasConflict: false,
    conflictingEvents: [],
  };
}

const scheduleAppointmentTool = tool({
  description: "Schedule an appointment on the agent's calendar",
  parameters: z.object({
    title: z.string().describe("Title of the appointment"),
    date: z.string().describe("Date of the appointment (YYYY-MM-DD)"),
    startTime: z.string().describe("Start time of the appointment (HH:MM)"),
    endTime: z.string().describe("End time of the appointment (HH:MM)"),
    client: z.string().describe("Name of the client"),
    location: z.string().optional().describe("Location of the appointment"),
    notes: z.string().optional().describe("Additional notes"),
  }),
  execute: async ({ title, date, startTime, endTime, client, location, notes }) => {
    try {
      // Check for conflicts
      const conflictCheck = await checkForConflicts(date, startTime, endTime);
      
      if (conflictCheck.hasConflict) {
        return {
          status: "conflict",
          message: "There is a scheduling conflict with an existing appointment.",
          conflictingEvents: conflictCheck.conflictingEvents,
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
      
      return appointment;
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      throw new Error("Failed to schedule appointment. Please try again later.");
    }
  },
});

export default scheduleAppointmentTool; 