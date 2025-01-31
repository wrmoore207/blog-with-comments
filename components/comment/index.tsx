// Importing the CommentForm component, which handles comment input and submission
import CommentForm from "./form";

// Importing the CommentList component, which displays the list of comments
import CommentList from "./list";

// Importing the custom hook useComments, which manages the state and logic for handling comments
import useComments from "../../hooks/useComment";

// Defining the main Comment component, which manages and displays comments
export default function Comment() {
  // Destructuring values from the useComments hook
  // - `text`: Current comment input value
  // - `setText`: Function to update the text state
  // - `comments`: List of existing comments
  // - `onSubmit`: Function to handle submitting a new comment
  // - `onDelete`: Function to handle deleting a comment
  const { text, setText, comments, onSubmit, onDelete } = useComments();

  return (
    // Main container div with top margin for spacing
    <div className="mt-20">
      {/* Rendering the comment input form */}
      <CommentForm onSubmit={onSubmit} text={text} setText={setText} />

      {/* Rendering the comment list, passing in comments and the delete function */}
      <CommentList comments={comments} onDelete={onDelete} />
    </div>
  );
}
