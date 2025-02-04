// Importing the `VFileCompatible` type, which represents compatible input types for the `vfile` processing
import type { VFileCompatible } from "vfile";
// Importing `remark`, a Markdown processor that allows transformations
import { remark } from "remark";
// Importing `remark-html`, a plugin that converts Markdown to HTML
import html from "remark-html";

/**
 * ---> FUNCTION: markdownToHtml <---
 * Converts a Markdown string into HTML
 * @param {VFileCompatible} markdown - The Markdown content to be converted  
 * @returns {Promise<string>} - The converted HTML as a string.
 */
export default async function markdownToHtml(markdown: VFileCompatible) {
  // Initialize the 'remark' Markdown processor and apply the 'remark-html' plugin
  const result = await remark()
  .use(html) // COnverts Markdown to HTML
  .process(markdown); // Processes the input Markdown content

  // Convert the processed result to a string (HTML format) and return it
  return result.toString();
}
