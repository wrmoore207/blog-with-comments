import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "./db";

export default async function fetchComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const events = await query(
      "SELECT id, title, start, end FROM events ORDER BY start ASC"
    );

    const formattedEvents = events.map((event) => ({
      ...event,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
    }));

    return res.status(200).json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Unexpected error occurred." });
  }
}
