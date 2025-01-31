// Importing the useAuth0 hook from the Auth0 React SDK
// This provides authentication-related functionalities such as login, logout, and user session status
import { useAuth0 } from "@auth0/auth0-react";

// Defining the type for the component props
// - `text`: The current value of the comment input field
// - `setText`: Function to update the `text` state when the user types
// - `onSubmit`: Function to handle the form submission, expected to return a Promise<void>
type CommentFormProps = {
  text: string;  // The content of the comment being typed
  setText: Function;  // Function to update the comment text state
  onSubmit: (e: React.FormEvent) => Promise<void>; // Async function for handling form submission
};

// Defining the CommentForm functional component with destructured props
export default function CommentForm({
  text,
  setText,
  onSubmit,
}: CommentFormProps) {
  // Extracting authentication-related functions and states from the Auth0 hook
  const { isAuthenticated, logout, loginWithPopup } = useAuth0();

  return (
    // The main form element, triggering the provided `onSubmit` function when submitted
    <form onSubmit={onSubmit}>
      {/* 
        Textarea for the user to enter their comment
        - `className`: Tailwind CSS classes for styling
        - `rows={2}`: Sets the height of the textarea
        - `placeholder`: Changes dynamically based on authentication status
        - `onChange`: Calls `setText` function to update state as the user types
        - `value={text}`: Controlled component, binds the input to the `text` state
        - `disabled={!isAuthenticated}`: Prevents typing if the user is not logged in
      */}
      <textarea
        className="flex w-full max-h-40 p-3 rounded resize-y bg-gray-200 text-gray-900 placeholder-gray-500"
        rows={2}
        placeholder={
          isAuthenticated
            ? `What are your thoughts?` // Prompt when logged in
            : "Please login to leave a comment" // Prompt when not logged in
        }
        onChange={(e) => setText(e.target.value)}
        value={text}
        disabled={!isAuthenticated} // Disable input if user is not authenticated
      />

      {/* 
        Wrapper div for the action buttons, ensuring proper layout
        - If the user is authenticated, show the submit and logout buttons
        - If not authenticated, show the login button
      */}
      <div className="flex items-center mt-4">
        {isAuthenticated ? (
          // When the user is logged in, show the comment submission and logout options
          <div className="flex items-center space-x-6">
            {/* Submit button */}
            <button 
              className="py-2 px-4 rounded bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700"
            >
              Send
            </button>

            {/* Logout button */}
            <button
              className="text-gray-500"
              onClick={() => logout({ returnTo: window.location.origin })} // Logs the user out and redirects to homepage
            >
              Log Out
            </button>
          </div>
        ) : (
          // If the user is not logged in, show the login button
          <button
            type="button"
            className="py-2 px-4 rounded bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700"
            onClick={() => loginWithPopup()} // Opens a popup for the user to log in
          >
            Log In
          </button>
        )}
      </div>
    </form>
  );
}