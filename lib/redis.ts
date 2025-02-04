// Import the 'ioredis' library to interact with a Redis database
import IORedis, { Redis } from "ioredis";


/**
 * ---> FUNCTION: fixUrl <---
 * Ensures the REdis connections URL is properly formatted.
 * Some Redis hosting providers require authentication in the URL,
 * but the format may vary. Thhis function corrects the format. 
 * @param {string} url - The Redis connection URL.
 * @returns {string} - The corrected Redis URL.
 */

function fixUrl(url: string) {
  if (!url) {
    return ""; // If no URL is provided, return an empty string
  }

  // Fix for 'redis://' URLs that are missing authentication credentials
  if (url.startsWith("redis://") && !url.startsWith("redis://:")) {
    return url.replace("redis://", "redis://:");
  }

  // Fix for 'rediss://' (SSL-encrypted Redis connections) with missing credentials
  if (url.startsWith("rediss://") && !url.startsWith("rediss://:")) {
    return url.replace("rediss://", "rediss://:");
  }
  return url; // Return the original or modified URL
}

/**
 * ---> CLASS: ClientRedis <---
 * Implements a Singleton pattern for managing the Redis connection
 * This ensures that only **one** Redis connection is created and shared across the applcation.
 */
class ClientRedis {
  // Static property to store the Redis instance (shared across the application)
  static instance: Redis;
  // Private constructor to prevent direct instantiation of the class
  constructor() {
    throw new Error("Use Singleton.getInstance()"); // Prevents 'new ClietRedis()' calls
  }

  /**
   * ---> FUNCTION: getInstance <---
   * Returns the single Redis instance, reacting it if necessary.
   * This method ensures that the Redis connection is only initialized once 
   * @returns {Redis | null} - The Redis instance
   */

  static getInstance(): Redis | null {
    // If no instance exists, create a new one
    if (!ClientRedis.instance) {
      ClientRedis.instance = new IORedis(fixUrl(process.env.REDIS_URL!));
    }
    return ClientRedis.instance;
  }
}
// Export the **single** instance of the Redis client
export default ClientRedis.getInstance();