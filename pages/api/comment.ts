// Import Next.js API request and response types for type safety
import type { NextApiRequest, NextApiResponse } from "next";

// Import functions that handle fetching, creating, and deleting comments
import fetchComment from "../../lib/fetchComment";  // Retrieves comments from Redis
import createComments from "../../lib/createComment";  // Stores new comments in Redis
import deleteComments from "../../lib/deleteComment";  // Removes comments from Redis

/**
 * 
 * ---> FUNCTION: hadler <---
 * Handles incoming API requests related to comments.
 * Supports GET, POST, and DELETE methods.
 */

export default async function handler(
  req: NextApiRequest,  // The API request object (contains headers, body, etc.)
  res: NextApiResponse, // The API response object (used to send responses)
) {
  // Switch statement to handle different HTTP methods
  switch (req.method) {
    case "GET":
      return fetchComment(req, res); // Fetch all comments for a given post
    case "POST":
      return createComments(req, res); // Create a new comment
    case "DELETE":
      return deleteComments(req, res); // Delete a comment
    default:
      return res.status(400).json({ message: "Invalid method." }); // Handle unsupported methods
  }
}