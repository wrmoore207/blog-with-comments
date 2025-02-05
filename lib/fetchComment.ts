import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "./db";
import clearUrl from "./clearUrl";

export default async function fetchComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = clearUrl(req.headers.referer);
  console.log(`Fetching comments for URL: ${url}`);

  if (!url) {
    return res.status(400).json({ message: "Missing referer." });
  }

  try {
    const rawComments = await query(
      "SELECT * FROM comments WHERE url = $1 ORDER BY created_at DESC",
      [url]
    );

    console.log("Fetched comments:", rawComments);

    const comments = rawComments.map((c) => ({
      ...c,
      created_at: new Date(c.created_at).toISOString(),
      user: {
        name: c.user_name,
        picture: c.user_picture,
        sub: c.user_sub,
      },
    }));

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Unexpected error occurred." });
  }
}
