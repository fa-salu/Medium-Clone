"use client";

import {
  createComment,
  fetchCommentsByStory,
  fetchRepliesByComment,
  createReply,
  deleteComment,
} from "@/lib/features/commentSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import DeletePopover from "../ui/deletePopover";
import { Button } from "@mui/material";

interface Props {
  storyId: string;
}

export default function CommentsSection({ storyId }: Props) {
  const { comments, replies } = useAppSelector(
    (state: RootState) => state.comment
  );

  const dispatch = useAppDispatch();
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});
  const [visibleReplies, setVisibleReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [replyInputVisible, setReplyInputVisible] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    dispatch(fetchCommentsByStory(storyId));
  }, [dispatch, storyId]);

  const handleCreate = () => {
    if (newComment.trim()) {
      dispatch(createComment({ content: newComment, storyId })).then(() => {
        dispatch(fetchCommentsByStory(storyId));
      });
      setNewComment("");
    }
  };

  const handleDelete = (commentId: string) => {
    dispatch(deleteComment(commentId));
  };

  const handleReplyChange = (commentId: string, value: string) => {
    setNewReply((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const handleReplySubmit = (commentId: string) => {
    if (newReply[commentId].trim()) {
      dispatch(
        createReply({
          content: newReply[commentId],
          storyId,
          parentCommentId: commentId,
        })
      ).then(() => {
        dispatch(fetchRepliesByComment(commentId));
      });
      setNewReply((prev) => ({
        ...prev,
        [commentId]: "",
      }));
      setReplyInputVisible((prev) => ({
        ...prev,
        [commentId]: false,
      }));
    }
  };

  const toggleReplyVisibility = (commentId: string) => {
    const isVisible = !visibleReplies[commentId];
    setVisibleReplies((prevState) => ({
      ...prevState,
      [commentId]: isVisible,
    }));

    if (isVisible) {
      dispatch(fetchRepliesByComment(commentId));
    }
  };

  const toggleReplyInputVisibility = (commentId: string) => {
    setReplyInputVisible((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  return (
    <div className="border-t w-full py-8 mt-10">
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Responses ({comments.length})
        </h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="What are your thoughts?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-500"
          />
          <Button
            onClick={handleCreate}
            type="button"
            className={`mt-2 px-4 py-2 rounded-lg ${
              newComment.trim()
                ? "text-black bg-slate-300 hover:bg-slate-500 hover:text-white"
                : " text-gray-500 cursor-not-allowed"
            }`}
            disabled={!newComment.trim()}
          >
            Respond
          </Button>
        </div>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b pb-6">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {comment.author.imageUri ? (
                    <img
                      src={comment.author.imageUri}
                      alt={comment.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm capitalize">
                      {comment.author.name}
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <p className="font-medium">{comment.author.name}</p>
                  <p className="text-sm text-gray-500">{comment.updatedAt}</p>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">
                {comment.content}
              </p>

              <div className="flex items-center justify-end space-x-4 text-gray-600 mt-3">
                <button
                  type="button"
                  className="flex items-center text-sm hover:text-gray-900"
                  onClick={() => toggleReplyVisibility(comment._id)}
                >
                  {visibleReplies[comment._id] ? (
                    <VisibilityOff className="mr-1" />
                  ) : (
                    <Visibility className="mr-1" />
                  )}
                  {visibleReplies[comment._id] ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  className="text-sm hover:text-gray-900"
                  onClick={() => toggleReplyInputVisibility(comment._id)}
                >
                  Reply
                </button>
                <DeletePopover onDelete={() => handleDelete(comment._id)} />
              </div>

              {replyInputVisible[comment._id] && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Write your reply..."
                    value={newReply[comment._id] || ""}
                    onChange={(e) =>
                      handleReplyChange(comment._id, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-500"
                  />
                  <Button
                    type="button"
                    onClick={() => handleReplySubmit(comment._id)}
                    className={`mt-2 px-4 py-2 rounded-lg ${
                      newReply[comment._id]?.trim()
                        ? " text-black bg-slate-300 hover:bg-slate-500 hover:text-white"
                        : "text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!newReply[comment._id]?.trim()}
                  >
                    Reply
                  </Button>
                </div>
              )}

              {visibleReplies[comment._id] && (
                <div className="mt-4">
                  {replies
                    .filter((reply) => reply.parentComment === comment._id)
                    .map((reply) => (
                      <div key={reply._id} className="ml-7 pb-6">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            {reply.author.imageUri ? (
                              <img
                                src={reply.author.imageUri}
                                alt={reply.author.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm capitalize">
                                {reply.author.name}
                              </div>
                            )}
                          </div>

                          <div className="ml-4">
                            <p className="font-medium">{reply.author.name}</p>
                            <p className="text-sm text-gray-500">
                              {reply.updatedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-800 whitespace-pre-wrap">
                            {reply.content}
                          </p>
                          <DeletePopover
                            onDelete={() => handleDelete(reply._id)}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 text-gray-700 font-medium hover:underline"
        >
          See all responses
        </button>
      </div>
    </div>
  );
}
