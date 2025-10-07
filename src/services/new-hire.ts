import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import { generatePaginationParams } from "@/lib/pagination-utils";

// Define types for attachment status
export type AttachmentStatus = 'to_do' | 'in_progress' | 'done';

export type AttachmentStatusDetail = {
  id: number;
  employee: number;
  attachment: number;
  employee_details: {
    id: number;
    emp_name: string;
    email: string;
    phone: string;
    role: string;
    education: string | null;
    bio: string | null;
    profile_picture: string | null;
    branch_department: number;
  };
  attachment_details: {
    id: number;
    checklist: number;
    title: string;
    detail: string;
    type: 'task' | 'training';
    created_at: string;
    files: {
      id: number;
      attachment: number;
      file: string;
      uploaded_at: string;
    }[];
  };
  status: AttachmentStatus;
  status_display: string;
  created_at: string;
  updated_at: string;
};

export type PaginatedAttachmentStatusList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttachmentStatusDetail[];
};

// Request types for updating attachment status
export type AttachmentStatusUpdateRequest = {
  status: AttachmentStatus;
};

export type AttachmentStatusUpdateResponse = AttachmentStatusDetail;

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
