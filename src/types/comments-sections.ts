/**
 * Comments Section component types
 */

// API Comment type (from backend)
export type ApiComment = {
  id: number;
  announcement: number;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  parent: number | null;
  replies?: ApiComment[];
  created_by_details?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_picture?: string | null;
  };
};

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

// API Response types
export type CommentListResponse = {
  count: number;
  page: number;
  page_size: number;
  results: ApiComment[];
};

export type CommentDetailResponse = ApiComment;

// API Request types
export type CreateCommentPayload = {
  announcement: number;
  content: string;
  parent?: number | null;
};

export type UpdateCommentPayload = {
  content: string;
};
