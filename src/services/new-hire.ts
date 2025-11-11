import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import { generatePaginationParams } from "@/lib/pagination-utils";
import type {
	PaginatedAttachmentStatusList,
	AttachmentStatusUpdateRequest,
	AttachmentStatusUpdateResponse,
	ExecutiveTrainingChecklistListResponse,
	ExecutiveTrainingChecklistDetail,
} from "@/types/services/new-hire";

// Attachment Status operations
export async function listAttachmentStatus(
  employeeId: number | string,
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  const url = API_ROUTES.NEW_HIRE.ATTACHEMENT_STATUS.LIST(employeeId);
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
  
  // Construct query string properly - API_ROUTES already includes ?employee_id=${id}
  const query = Object.keys(queryParams).length > 0 
    ? `&${new URLSearchParams(queryParams)}` 
    : "";
    
  const res = await apiCaller<PaginatedAttachmentStatusList>(`${url}${query}`, "GET");
  return res.data;
}

export async function updateAttachmentStatus(
  id: number | string, 
  payload: AttachmentStatusUpdateRequest
) {
  const res = await apiCaller<AttachmentStatusUpdateResponse>(
    API_ROUTES.NEW_HIRE.ATTACHEMENT_STATUS.UPDATE(id), 
    "PATCH", 
    payload, 
    {}, 
    "json"
  );
  return res.data;
}

// Executive Training Checklist service functions
export async function listExecutiveTrainingChecklists(
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  const queryParams: Record<string, string> = {};
  
  // Add search and filter parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      queryParams[key] = String(value);
    });
  }
  
  // Add pagination parameters
  if (pagination) {
    if (pagination.page !== undefined) {
      queryParams.page = String(pagination.page);
    }
    if (pagination.pageSize !== undefined) {
      queryParams.page_size = String(pagination.pageSize);
    }
  }
  
  const query = Object.keys(queryParams).length > 0
    ? `?${new URLSearchParams(queryParams)}`
    : "";
    
  const res = await apiCaller<ExecutiveTrainingChecklistListResponse>(
    `${API_ROUTES.NEW_HIRE.TRAINING_CHECKLIST.LIST}${query}`,
    "GET"
  );
  return res.data;
}

export async function getExecutiveTrainingChecklist(id: number | string) {
  const res = await apiCaller<ExecutiveTrainingChecklistDetail>(
    API_ROUTES.NEW_HIRE.TRAINING_CHECKLIST.DETAIL(id),
    "GET"
  );
  return res.data;
}