/**
 * Comments Section component types
 */

// API Comment type (from backend)
export type ApiComment = {
  id: number;
  announcement: number;
  author: number;
  parent: number | null;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  author_details: {
    id: number;
    emp_name: string;
    email: string;
    phone: string;
    role: string;
    role_id: number;
    profile_picture: string | null;
    branch_department_ids: number[];
  };
  replies?: ApiComment[];
  can_edit: boolean;
  can_delete: boolean;
  reply_count: number;
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
  comments: {
    count: number;
    results: ApiComment[];
  };
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
