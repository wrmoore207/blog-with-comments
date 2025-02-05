import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "./db";
import getUser from "./getUser";

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { text } = req.body;
    const { authorization } = req.headers;

    if (!text || !authorization) {
      return res.status(400).json({ message: "Missing parameter." });
    }

    // Verify User
    const user = await getUser(authorization);
    if (!user || !user.name || !user.picture || !user.sub) {
      console.error("Invalid user data:", user);
      return res.status(400).json({ message: "Invalid user data." });
    }

    const { referer } = req.headers;
    if (!referer) return res.status(400).json({ message: "Missing referer." });

    // Insert comment into PostgreSQL (ensure user data is stored correctly)
    const result = await query(
      "INSERT INTO comments (text, url, user_name, user_picture, user_sub, created_at) VALUES ($1, $2, $3, $4, $5, NOW()::timestamp) RETURNING *",
      [text, referer, user.name, user.picture, user.sub]
    );    

    return res.status(200).json(result[0]); // Return newly created comment
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ message: "Unexpected error occurred." });
  }
}
