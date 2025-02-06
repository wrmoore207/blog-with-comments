import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "./db";
import clearUrl from "./clearUrl";

export default async function fetchComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = clearUrl(req.headers.referer);
  console.log(`Fetching comments for URL: ${url}`);

  try {
    const rawComments = await query(
      `SELECT id, text, url, created_at FROM comments WHERE url = $1 ORDER BY created_at DESC`,
      [url]
    );

    console.log("Raw comments from DB:", rawComments);

    const comments = rawComments.map((c) => ({
      ...c,
      created_at: new Date(c.created_at).toISOString(), // Ensure proper format
      user: {
        name: c.user_name,
        picture: c.user_picture,
        sub: c.user_sub,
      },
    }));

    console.log("Formatted comments for frontend:", comments);

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Unexpected error occurred." });
  }
}
