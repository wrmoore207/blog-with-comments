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
      `SELECT id, title, start, "end", description FROM events ORDER BY start ASC`
    );

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching events." });
  }
}

// Create a new event
async function createEvent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, start, end, description } = req.body;

    if (!title || !start || !end) {
      return res.status(400).json({ message: "Missing parameters." });
    }

    const result = await query(
      `INSERT INTO events (title, start, "end", description) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, start, end, description]
    );

    return res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Error creating event." });
  }
}