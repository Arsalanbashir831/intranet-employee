import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import { generatePaginationParams } from "@/lib/pagination-utils";
import type {
	Comment,
	CommentListResponse,
	CommentDetailResponse,
	CreateCommentPayload,
	UpdateCommentPayload,
} from "@/types/comments-sections";

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
    const paginationParams = generatePaginationParams(
      pagination.page ? pagination.page - 1 : 0,
      pagination.pageSize || 10
    );
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
