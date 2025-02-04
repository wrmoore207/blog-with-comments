// Importing necessary typs from NExt.js for API request and response handling
import type { NextApiRequest, NextApiResponse } from "next";
// Importing the Comment type from interfaces 
import type { Comment } from "../interfaces";
// Importing Redis client instance to store and retrieve data
import redis from "./redis";
// Importing nanoid to generate unique IDs for each comment
import { nanoid } from "nanoid";
// Importing helper function getUser to extract user details from authorization token
import getUser from "./getUser";
// Importing helper function clearUrl to clean the URL (removes query params and fragments)
import clearUrl from "./clearUrl";


// ---> Main function: Handles comment creation <---
export default async function createComments(
  req: NextApiRequest, // API Request object (contains headers, body, etc)
  res: NextApiResponse, // API Response object (used to send responses)
) {
  // Extract and clean the referer URL (the page where the comment is posted)
  const url = clearUrl(req.headers.referer);
  // Extract the comment text from the request body
  const { text } = req.body;
  // Extract the authorization token from request headers
  const { authorization } = req.headers;

  // Validate input: check if text and authorizaiton token are provided 
  if (!text || !authorization) {
    return res.status(400).json({ message: "Missing parameter." });
  }
  
  // Check if Redis client is available
  if (!redis) {
    return res
      .status(400)
      .json({ message: "Failed to connect to redis client." });
  }

  try {
    // ---> USER AUTHENTICATION <---
    // Verify the user's authorization token and get their details
    const user = await getUser(authorization);
    // If user verification fails, return an error message
    if (!user) return res.status(400).json({ message: "Need authorization." });
    // Otherwise extract their details from the auth response
    const { name, picture, sub, email } = user;
    /// ---> CREATE COMMENT OBJECT <---
    const comment: Comment = {
      // Generate a unique ID for the comment
      id: nanoid(),
      // Timestamp for when the comment is made
      created_at: Date.now(),
      // Cleaned URL where comment is posted
      url,
      // The comment content
      text,
      // Comment Author info
      user: { name, picture, sub, email },
    };

    // ---> Store Comment in Redis <---
    // Push the new comment into a Redis list associated with the URL
    await redis.lpush(url, JSON.stringify(comment));

    // Return the newly created comment as a JSON response
    return res.status(200).json(comment);
  } catch (_) {
    // Handle any unexpected errors
    return res.status(400).json({ message: "Unexpected error occurred." });
  }
}