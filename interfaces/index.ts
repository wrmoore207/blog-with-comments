export type User = {
  name: string; // User's display name
  picture: string; // URL to the user's profile picture
  sub: string; // Unique authentication identifier (from Auth0)
  email?: string; // User's email address
};

export type Comment = {
  id: string; // Unique ID for the comment
  created_at: number; // Timestamp 
  url: string; // THe URL of the post where the comment is made
  text: string; // The actual comment text
  user: User; // User who wrote the comment
};

export type Post = {
  slug?: string; // (optional) Unique identifier in the URL
  title?: string; // (optional) Title of the post
  author?: string; // (optional) Author's name 
  date?: Date; // (optional) Date of Publication
  content?: string; // (optional) Full content of the post
  excerpt?: string; // (optional) Short preview text of the post
  [key: string]: any; // Allows any additional properties
};