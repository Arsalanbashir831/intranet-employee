import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";

// Define types based on the API response
export type CommentAuthor = {
  id: number;
  emp_name: string;
  email: string;
  phone: string;
  role: string;
  profile_picture: string | null;
  branch_department_ids: number[];
};

export type Comment = {
  id: number;
  announcement: number;
  author: number;
  parent: number | null;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  author_details: CommentAuthor;
  replies: Comment[];
  can_edit: boolean;
  can_delete: boolean;
  reply_count: number;
};

export type CommentListResponse = {
  comments: {
    count: number;
    page: number;
    page_size: number;
    results: Comment[];
  };
};

export type CommentDetailResponse = Comment;

export type CreateCommentPayload = {
  announcement: number;
  content: string;
  parent?: number | null;
};

export type UpdateCommentPayload = {
  content: string;
};

// Comment CRUD operations
export async function listComments(
  announcementId: number | string,
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  const url = API_ROUTES.KNOWLEDGE_BASE.COMMENTS.LIST;
  const queryParams: Record<string, string> = {
    announcement: String(announcementId),
    // Add parameter to get full nested replies
    include_nested: "true"
  };
  
  // Add pagination parameters
  if (pagination) {
    const paginationParams = {
      page: (pagination.page || 1).toString(),
      page_size: (pagination.pageSize || 10).toString(),
    };
    Object.assign(queryParams, paginationParams);
  }
  
  // Add other parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      queryParams[key] = String(value);
    });
  }
  
  const query = `?${new URLSearchParams(queryParams)}`;
    
  const res = await apiCaller<CommentListResponse>(`${url}${query}`, "GET");
  return res.data;
}

export async function getComment(id: number | string) {
  const res = await apiCaller<CommentDetailResponse>(
    API_ROUTES.KNOWLEDGE_BASE.COMMENTS.DETAIL(id), 
    "GET"
  );
  return res.data;
}

export async function createComment(payload: CreateCommentPayload) {
  const res = await apiCaller<Comment>(
    API_ROUTES.KNOWLEDGE_BASE.COMMENTS.CREATE,
    "POST",
    payload
  );
  return res.data;
}

export async function updateComment(id: number | string, payload: UpdateCommentPayload) {
  const res = await apiCaller<Comment>(
    API_ROUTES.KNOWLEDGE_BASE.COMMENTS.UPDATE(id),
    "PATCH",
    payload
  );
  return res.data;
}

export async function deleteComment(id: number | string) {
  const res = await apiCaller<void>(
    API_ROUTES.KNOWLEDGE_BASE.COMMENTS.DELETE(id),
    "DELETE"
  );
  return res.data;
}
