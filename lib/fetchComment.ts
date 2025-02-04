// Import Next.js API request/response types for type safety
import type { NextApiRequest, NextApiResponse } from "next";
// Importing the Comment type from interfaces
import type { Comment } from "../interfaces";
// Importing the Redis client instance for retrieving stored comments
import redis from "./redis";
// Import hleper function to clean URLs
import clearUrl from "./clearUrl";

// ---> FETCH COMMENTS FUNCTION <---
// Feteches all comments associated with a specifc URL from Redis
export default async function fetchComment(
  req: NextApiRequest, // API request object
  res: NextApiResponse, // API response object
) {
  // Extract and clean the URL where the comments are stored
  const url = clearUrl(req.headers.referer);
  // Check if Redis is available, throw error if not
  if (!redis) {
    return res.status(500).json({ message: "Failed to connect to redis." });
  }

  try {
    /** ---> RETRIEVE COMMENTS FROM REDIS <---
     *  Fetch all stored comments for the given URL
     * lrange(url, 0, -1) retrieves all items from the Redis list (from start to end)
    */ 
    const rawComments = await redis.lrange(url, 0, -1);

    /** ---> CONVERT STRING DATA BACK TO OBJECTS <--- 
     * Redis stores JSON strings, so we need to parse them back into objects
     * 
    */
    const comments = rawComments.map((c) => {
      const comment: Comment = JSON.parse(c);

      // Remove the user's email before returning (to protect privacy)
      delete comment.user.email;
      return comment; // Return the sanitized comment object
    });

    // ---> SEND RESPONSE WITH COMMENT DATA <---
    return res.status(200).json(comments);
  } catch (_) {
    // Handle unexpected errors
    return res.status(400).json({ message: "Unexpected error occurred." });
  }
}
