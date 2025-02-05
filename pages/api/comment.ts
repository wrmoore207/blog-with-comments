import type { NextApiRequest, NextApiResponse } from "next";
import fetchComment from "../../lib/fetchComment";
import createComments from "../../lib/createComment";
import deleteComments from "../../lib/deleteComment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Incoming request: ${req.method}`);

  switch (req.method) {
    case "GET":
      console.log("Fetching comments...");
      return fetchComment(req, res);
    case "POST":
      console.log("Creating a new comment...");
      return createComments(req, res);
    case "DELETE":
      console.log("Deleting a comment...");
      return deleteComments(req, res);
    default:
      console.log("Invalid method.");
      return res.status(400).json({ message: "Invalid method." });
  }
}
