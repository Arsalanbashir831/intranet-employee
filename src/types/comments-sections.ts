/**
 * Comments Section component types
 */

// Component-specific Comment type (different from API Comment type)
export type Comment = {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
    department?: string;
  };
  content: string;
  createdAt: string;
  isEdited?: boolean;
  replies?: Comment[];
  isExpanded?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  replyCount?: number;
};

export type CommentUser = {
  name: string;
  avatar?: string;
  role?: string;
  department?: string;
};

export type CommentsSectionProps = {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditComment?: (commentId: string, newContent: string) => void;
  currentUser?: CommentUser;
  className?: string;
};

export type CommentItemProps = {
  comment: Comment;
  level: number;
  onReply: (parentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string, newContent: string) => void;
  currentUser?: CommentUser;
};
