import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "./db";
import getUser from "./getUser"; // Fixed incorrect import path

export default async function deleteComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract comment data and authorization header
    const { comment } = req.body;
    const { authorization } = req.headers;

    // Validate required parameters
    if (!comment || !authorization) {
      return res.status(400).json({ message: "Missing parameter." });
    }

    // Verify User
    const user = await getUser(authorization);
    if (!user) {
      return res.status(400).json({ message: "Invalid authorization token." });
    }

    // Check if the user is an admin or the author of the comment
    const isAdmin = process.env.NEXT_PUBLIC_AUTH0_ADMIN_EMAIL === user.email;
    const isAuthor = user.sub === comment.user_sub;

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: "Unauthorized." });
    }

    // Delete the comment from the database
    await query("DELETE FROM comments WHERE id = $1", [comment.id]);

    return res.status(200).end();
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: "Unexpected error occurred." });
  }
}