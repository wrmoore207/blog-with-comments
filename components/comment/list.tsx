import type { Comment } from "../../interfaces";
import distanceToNow from "../../lib/dateRelative";
import { useAuth0 } from "@auth0/auth0-react";

type CommentListProps = {
  comments?: Comment[];
  onDelete: (comment: Comment) => Promise<void>;
};

export default function CommentList({ comments, onDelete }: CommentListProps) {
  const { user } = useAuth0();

  console.log("Rendering comments:", comments);

  return (
    <div className="space-y-6 mt-10">
      {comments &&
        comments.map((comment) => {
          if (!comment.user) return null;

          const isAuthor = user && user.sub === comment.user.sub;
          const isAdmin =
            user && user.email === process.env.NEXT_PUBLIC_AUTH0_ADMIN_EMAIL;

          return (
            <div key={comment.created_at} className="flex space-x-4">
              <div className="flex-shrink-0">
                {comment.user.picture ? (
                  <img
                    src={comment.user.picture}
                    alt={comment.user.name || "Anonymous"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span>?</span>
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <div className="flex space-x-2">
                  <b>{comment.user.name || "Anonymous"}</b>
                  <time className="text-gray-400">
                    {comment.created_at
                      ? distanceToNow(new Date(comment.created_at))
                      : "Unknown time"}
                  </time>

                  {(isAdmin || isAuthor) && (
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => onDelete(comment)}
                      aria-label="Delete comment"
                    >
                      x
                    </button>
                  )}
                </div>

                <div>{comment.text}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
