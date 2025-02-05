// Import the Comment type definition to enforce TypeScript type safety
import type { Comment } from "../../interfaces";

// Importing a utility function that formats timestamps into relative time (e.g., "2 hours ago")
import distanceToNow from "../../lib/dateRelative";

// Importing the useAuth0 hook to get user authentication details
import { useAuth0 } from "@auth0/auth0-react";

// Defining the props expected by the CommentList component
type CommentListProps = {
  comments?: Comment[]; // An optional array of comments to display
  onDelete: (comment: Comment) => Promise<void>; // Function to handle comment deletion asynchronously
};

// Defining the CommentList component, which displays a list of comments
export default function CommentList({ comments, onDelete }: CommentListProps) {
  // Extracting the logged-in user's details from the Auth0 authentication hook
  const { user } = useAuth0();

  return (
    // Main container with margin and spacing between comments
    <div className="space-y-6 mt-10">
      {/* Log comments data to debug missing user properties */}
      {console.log("Comments data:", comments)}

      {/* Rendering comments if they exist */}
      {comments &&
        comments.map((comment) => {
          // Ensure that `comment.user` exists before accessing its properties
          if (!comment.user) {
            return null; // Skip rendering comments without user details
          }

          // Checking if the logged-in user is the author of the comment
          const isAuthor = user && user.sub === comment.user.sub;

          // Checking if the logged-in user is an admin (using an environment variable)
          const isAdmin =
            user && user.email === process.env.NEXT_PUBLIC_AUTH0_ADMIN_EMAIL;

          return (
            // Each comment is wrapped in a container with a unique key (comment timestamp)
            <div key={comment.created_at} className="flex space-x-4">
              {/* Avatar image for the comment author */}
              <div className="flex-shrink-0">
                {comment.user.picture ? (
                  <img
                    src={comment.user.picture} // User profile picture
                    alt={comment.user.name || "Anonymous"} // Prevent error if name is missing
                    width={40}
                    height={40}
                    className="rounded-full" // Makes the image circular
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span>?</span> {/* Placeholder for missing profile pictures */}
                  </div>
                )}
              </div>

              {/* Comment content container */}
              <div className="flex-grow">
                {/* Displaying the author's name, timestamp, and delete button (if applicable) */}
                <div className="flex space-x-2">
                  {/* Comment author's name in bold */}
                  <b>{comment.user.name || "Anonymous"}</b> {/* Default name if missing */}

                  {/* Displaying the relative time of when the comment was posted */}
                  <time className="text-gray-400">
                    {comment.created_at ? distanceToNow(new Date(comment.created_at)) : "Unknown time"}
                  </time>


                  {/* Show delete button only if the user is an admin or the comment author */}
                  {(isAdmin || isAuthor) && (
                    <button
                      className="text-gray-400 hover:text-red-500" // Style changes on hover
                      onClick={() => onDelete(comment)} // Calls the delete function when clicked
                      aria-label="Delete comment" // Accessibility label for screen readers
                    >
                      x
                    </button>
                  )}
                </div>

                {/* Displaying the comment text */}
                <div>{comment.text}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}