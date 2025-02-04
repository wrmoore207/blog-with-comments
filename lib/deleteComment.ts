// Importing request/response handling
import type { NextApiRequest, NextApiResponse } from "next";
// Importing User and Comment types from interfaces
import type { User, Comment } from "../interfaces";
// Importing Redis client instance for interacting with the database
import redis from "./redis";
// Importing helper function to verify and extract user details from the authorization token
import getUser from "./getUser";
// Importing helper funciton to strip URL quer params and fragments
import clearUrl from "./clearUrl";

// ---> Main Function to Delete Comments <---
export default async function deleteComments(
  // API request object containing headers, body, etc
  req: NextApiRequest,
  // API Response
  res: NextApiResponse,
) {
  // Extract and clean the referer URL (page where the comment exists)
  const url = clearUrl(req.headers.referer);
  // Extract the comment and its associated URL from the request body
  const { comment }: { url: string; comment: Comment } = req.body;
  // Extract authorization token from request headers
  const { authorization } = req.headers;
  // Validate input: check if both 'comment' and 'authorization' exist as valid
  if (!comment || !authorization) {
    return res.status(400).json({ message: "Missing parameter." });
  }
  // Check if the Redis client is available
  if (!redis) {
    return res.status(500).json({ message: "Failed to connect to redis." });
  }

  try {
    // ---> User Authentication <---
    // Verify the user's authorization token and get their details
    const user: User = await getUser(authorization);
    // If verification fails, send message
    if (!user) return res.status(400).json({ message: "Invalid token." });
    // Make sure the email belonging to the comment matches the email of the authenticated user
    comment.user.email = user.email;

    // Check if the user is an admin (based on the environment variable)
    const isAdmin = process.env.NEXT_PUBLIC_AUTH0_ADMIN_EMAIL === user.email;
    // Check if the user is the authoer of the comment
    const isAuthor = user.sub === comment.user.sub;
    // If the user is neither an admin nor the author, deny deletion
    if (!isAdmin && !isAuthor) {
      return res.status(400).json({ message: "Need authorization." });
    }

    // --->Delete Comment from Redis<---
    // 'lrem' removes the specified comment from the Redis list for the given URL
    await redis.lrem(url, 0, JSON.stringify(comment));
    // Respond with success status
    return res.status(200).end();
  } catch (err) {

    // Handle unexpected errors
    return res.status(400);
  }
}