import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "./db";
import getUser from "./getUser";
import clearUrl from "./clearUrl";

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = clearUrl(req.headers.referer);
  const { text } = req.body;
  const { authorization } = req.headers;

  console.log(`Creating comment for URL: ${url}`);

  if (!text || !authorization || !url) {
    return res.status(400).json({ message: "Missing parameter." });
  }

  try {
    const user = await getUser(authorization);
    if (!user) return res.status(400).json({ message: "Need authorization." });

    const result = await query(
      "INSERT INTO comments (text, url, user_name, user_picture, user_sub, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [text, url, user.name, user.picture, user.sub]
    );

    console.log("Comment created:", result);

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ message: "Unexpected error occurred." });
  }
}
