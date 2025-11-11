import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import { generatePaginationParams } from "@/lib/pagination-utils";
import type {
	PollListResponse,
	PollResultsResponse,
	PollVoteResponse,
} from "@/types/polls";

// Poll CRUD operations
export async function listPolls(
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  const url = API_ROUTES.KNOWLEDGE_BASE.POLLS.LIST;
  const queryParams: Record<string, string> = {};
  
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
  
  const query = Object.keys(queryParams).length > 0 
    ? `?${new URLSearchParams(queryParams)}` 
    : "";
    
  const res = await apiCaller<PollListResponse>(`${url}${query}`, "GET");
  return res.data;
}

export async function getPollResults(id: number | string) {
  const res = await apiCaller<PollResultsResponse>(
    API_ROUTES.KNOWLEDGE_BASE.POLLS.RESULTS(id), 
    "GET"
  );
  return res.data;
}

export async function votePoll(id: number | string, optionId: number) {
  const res = await apiCaller<PollVoteResponse>(
    API_ROUTES.KNOWLEDGE_BASE.POLLS.VOTE(id),
    "POST",
    { option_id: optionId }
  );
  return res.data;
}
