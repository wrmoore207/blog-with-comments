import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "./db";

export default async function fetchComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { referer } = req.headers;
    if (!referer) return res.status(400).json({ message: "Missing referer." });

    const comments = await query(
      "SELECT id, text, url, user_name, user_picture, user_sub, created_at FROM comments WHERE url = $1 ORDER BY created_at DESC",
      [referer]
    );

    // Ensure `created_at` is a valid Date object
    const formattedComments = comments.map((comment) => ({
      ...comment,
      created_at: comment.created_at ? new Date(comment.created_at).toISOString() : null,
      user: {
        name: comment.user_name || "Anonymous",
        picture: comment.user_picture || null,
        sub: comment.user_sub || null,
      },
    }));

    return res.status(200).json(formattedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Unexpected error occurred." });
  }
}
