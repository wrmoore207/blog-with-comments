import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getEvents(req, res);
    case "POST":
      return createEvent(req, res);
    default:
      return res.status(400).json({ message: "Invalid method." });
  }
}

// Fetch all events
async function getEvents(req: NextApiRequest, res: NextApiResponse) {
  try {
    const events = await query(
      `SELECT id, title, start, "end" FROM events ORDER BY start ASC`
    );

    return res.status(200).json(
      events.map((event) => ({
        ...event,
        start: new Date(event.start).toISOString(),
        end: new Date(event.end).toISOString(), // Ensure correct format
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Error fetching events." });
  }
}

// Create a new event
async function createEvent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, start, end } = req.body;

    // Ensure all parameters are provided
    if (!title || !start || !end) {
      console.error("Missing parameters:", { title, start, end });
      return res.status(400).json({ message: "Missing parameters." });
    }

    // Insert event into PostgreSQL (use "end" with double quotes)
    const result = await query(
      `INSERT INTO events (title, start, "end") VALUES ($1, $2, $3) RETURNING *`,
      [title, start, end]
    );

    return res.status(201).json(result[0]); // Respond with the created event
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Error creating event." });
  }
}
