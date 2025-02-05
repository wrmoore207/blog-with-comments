// Import Next.js API request and response types for type safety
import type { NextApiRequest, NextApiResponse } from "next";

// Import functions that handle fetching, creating, and deleting comments
import {query} from "../../lib/db";
import getUser from "../../lib/getUser";
import fetchComment from "../../lib/fetchComment";
import createComment from "../../lib/createComment";
import deleteComment from "../../lib/deleteComment";

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
      return createComment(req, res); // Create a new comment
    case "DELETE":
      return deleteComment(req, res); // Delete a comment
    default:
      return res.status(400).json({ message: "Invalid method." }); // Handle unsupported methods
  }
}