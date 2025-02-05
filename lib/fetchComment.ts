import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "./db";

export default async function fetchComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    const {referer} = req.headers;
    if (!referer) return res.status(400).json({message: "Missing referer."});

    const comments = await query("SELECT * FROM comments WHERE url = $1 ORDER BY created_at DESC", [referer]);

    return res.status(200)>json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({message: "Unexpected error occured."});
  }
}