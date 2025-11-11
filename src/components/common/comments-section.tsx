"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reply, MoreHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type {
  Comment,
  CommentsSectionProps,
  CommentItemProps,
} from "@/types/comments-sections";

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

// Comment Item Component
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  level,
  onReply,
  onDelete,
  onEdit,
  currentUser,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isExpanded, setIsExpanded] = useState(comment.isExpanded ?? true);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit?.(comment.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const canEdit = comment.canEdit ?? currentUser?.name === comment.author.name;
  const canDelete =
    comment.canDelete ?? currentUser?.name === comment.author.name;

  return (
    <div
      className={cn(
        "space-y-3",
        level > 0 &&
          "ml-2 sm:ml-4 md:ml-6 border-l-2 border-gray-100 pl-2 sm:pl-3 md:pl-4"
      )}
    >
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-sm",
          level > 0 && "bg-gray-50/50"
        )}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback className="bg-[#E5004E] text-white text-xs">
                {comment.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {comment.author.name}
                  </h4>
                  {comment.author.role && (
                    <Badge
                      variant="secondary"
                      className="text-xs hidden sm:inline-flex"
                    >
                      {comment.author.role}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-400 italic">
                      (edited)
                    </span>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                    placeholder="Edit your comment..."
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleEdit}
                      disabled={!editContent.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(comment.content);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(!isReplying)}
                    className="h-7 sm:h-8 px-1 sm:px-2 text-xs"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                </div>

                {(canEdit || canDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canEdit && (
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                          Edit
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete?.(comment.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {isReplying && (
                <div className="mt-4 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${comment.author.name}...`}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={!replyContent.trim()}
                    >
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsReplying(false);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.length > 3 && !isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className={cn(
                "text-xs text-gray-500 hover:text-gray-700",
                level > 0 ? "ml-2 sm:ml-4" : "ml-2 sm:ml-6"
              )}
            >
              <ChevronRight className="h-3 w-3 mr-1" />
              Show {countHiddenReplies(comment.replies, 3)} more replies
            </Button>
          )}

          {isExpanded &&
            comment.replies
              .slice(0, isExpanded ? comment.replies.length : 3)
              .map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  level={level + 1}
                  onReply={onReply}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  currentUser={currentUser}
                />
              ))}

          {comment.replies.length > 3 && isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className={cn(
                "text-xs text-gray-500 hover:text-gray-700",
                level > 0 ? "ml-2 sm:ml-4" : "ml-2 sm:ml-6"
              )}
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              Show less
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to count all comments including nested replies
const countAllComments = (comments: Comment[]): number => {
  return comments.reduce((total, comment) => {
    const repliesCount = comment.replies
      ? countAllComments(comment.replies)
      : 0;
    return total + 1 + repliesCount; // +1 for the comment itself
  }, 0);
};

// Helper function to count hidden replies including nested ones
const countHiddenReplies = (
  replies: Comment[],
  visibleCount: number
): number => {
  if (replies.length <= visibleCount) return 0;

  const hiddenReplies = replies.slice(visibleCount);
  return countAllComments(hiddenReplies);
};

// Main Comments Section Component
export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
  onDeleteComment,
  onEditComment,
  currentUser,
  className,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (parentId: string, content: string) => {
    onAddComment(content, parentId);
  };

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {/* Add Comment Form */}
      <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="bg-[#E5004E] text-white text-xs">
                {currentUser?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[80px] sm:min-h-[100px] resize-none text-sm"
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-[#E5004E] hover:bg-[#E5004E]/90 text-sm px-4 py-2"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {countAllComments(comments) === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              level={0}
              onReply={handleReply}
              onDelete={onDeleteComment}
              onEdit={onEditComment}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
