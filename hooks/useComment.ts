// Importing the Comment type to enforce type safety for the comments list
import type { Comment } from "../interfaces";

// Importing React's useState hook to manage state within the component
import React, { useState } from "react";

// Importing useSWR, a data-fetching hook for remote state synchronization
import useSWR from "swr";

// Importing useAuth0 to handle authentication and access token retrieval
import { useAuth0 } from "@auth0/auth0-react";

// --- DATA FETCHING FUNCTION ---
// This function is used as a fetcher for useSWR to retrieve data from an API.
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (res.ok) {
      return res.json(); // If the request is successful, parse the response as JSON
    }
    // If there's an error, throw a detailed error message
    throw new Error(`${res.status} ${res.statusText} while fetching: ${url}`);
  });

// --- CUSTOM HOOK FOR COMMENTS ---
export default function useComments() {
  // Extracts the getAccessTokenSilently function from the useAuth0 hook
  // This function retrieves the access token for authentication-protected API calls
  const { getAccessTokenSilently } = useAuth0();

  // State to hold the user's input text for a new comment
  const [text, setText] = useState("");

  // useSWR Hook for fetching comments
  // - `data` stores the retrieved comments and is renamed as `comments`
  // - `mutate` is a function that allows us to revalidate the data after an update
  // - `fallbackData: []` ensures `comments` is initialized as an empty array to prevent undefined errors
  const { data: comments, mutate } = useSWR<Comment[]>(
    "/api/comment", // API endpoint to fetch comments
    fetcher, // The function used to fetch data
    { fallbackData: [] } // Default value to avoid undefined errors before data loads
  );

  // --- FUNCTION TO HANDLE COMMENT SUBMISSION ---
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the form from reloading the page

    // Retrieve an access token to authorize the request
    const token = await getAccessTokenSilently();

    try {
      // Send a POST request to the API to add a new comment
      await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({ text }), // The text of the new comment
        headers: {
          Authorization: token, // Auth header with the retrieved token
          "Content-Type": "application/json", // Specifies the request body is JSON
        },
      });

      // Clear the input field after a successful submission
      setText("");

      // Refresh the comment list to include the newly added comment
      await mutate();
    } catch (err) {
      console.log(err); // Log any errors to the console
    }
  };

  // --- FUNCTION TO HANDLE COMMENT DELETION ---
  const onDelete = async (comment: Comment) => {
    // Retrieve an access token to authorize the request
    const token = await getAccessTokenSilently();

    try {
      // Send a DELETE request to remove the selected comment
      await fetch("/api/comment", {
        method: "DELETE",
        body: JSON.stringify({ comment }), // Send the comment object to delete
        headers: {
          Authorization: token, // Auth header with the retrieved token
          "Content-Type": "application/json", // Specifies the request body is JSON
        },
      });

      // Refresh the comment list to reflect the deletion
      await mutate();
    } catch (err) {
      console.log(err); // Log any errors to the console
    }
  };

  // Returning the state and functions so they can be used in components
  return { text, setText, comments, onSubmit, onDelete };
}