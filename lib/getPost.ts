//Importing the `Post` type to ensure structured post data
import type { Post } from "../interfaces";

// Importing `fs` (Node.js file system module) to read post files from disk
import fs from "fs";

// Importing `join` from the `path` module to construct file paths
import { join } from "path";

// Importing `gray-matter`, a library for parsing Markdown files with frontmatter
import matter from "gray-matter";

/**
 * ---> DIRECTORY WHERE POSTS ARE STORED <---
 * '_posts/' is where the posts are stored as markdown files
 */
const postsDirectory = join(process.cwd(), "_posts");

/**
 * ---> FUNCTION: getPostSlugs <---
 * Retrieves the filenames (slugs) of all posts in the '_posts' directory.
 * @returns {string[]} - an array of filenames ie: ["post1.md", "post2.md" etc]
 */
export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

/**
 * 
 * @param slug Retrieves a post's metadata and content based on its slug
 * @param fields {string} slug - The filename of the post (without the '.md' extension)
 * @returns {Post} - An object containing the requested fields of the post
 */
export function getPostBySlug(slug: string, fields: string[] = []) {
  // Remove '.md' from filename
  const realSlug = slug.replace(/\.md$/, "");
  // Construct the full path to the Markdown file
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  // Read the file's content as a string
  const fileContents = fs.readFileSync(fullPath, "utf8");
  // Use 'gray-matter' to parse the Markdown file's markdown (frontmatter)
  const { data, content } = matter(fileContents);
  // Create an empty object to store onbly the requested fields
  const items: Post = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug; // Store the slug of the post
    }
    if (field === "content") {
      items[field] = content; // Store the post content
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field]; // Store other requested Metadata fields
    }
  });

  return items; // Returns only requested fields
}

export function getAllPosts(fields: string[] = []) {
  // Retrieve the filenames (slugs) of all posts
  const slugs = getPostSlugs();

  // Retrieve post data for each slug
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))

    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

    return posts; // Return sorted array of posts
}
