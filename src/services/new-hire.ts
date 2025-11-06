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

// Executive Training Checklist types
export type ExecutiveTrainingChecklistAssignedTo = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  branches: Array<{
    id: number;
    name: string;
  }>;
  departments: Array<{
    id: number;
    name: string;
  }>;
};

export type ExecutiveTrainingChecklist = {
  id: number;
  title: string;
  description: string;
  deadline: string | null;
  assigned_to: ExecutiveTrainingChecklistAssignedTo[];
  assigned_by: string | null;
  checklist_id: number;
  created_at: string;
};

export type ExecutiveTrainingChecklistListResponse = {
  training_checklists: {
    count: number;
    page: number;
    page_size: number;
    results: ExecutiveTrainingChecklist[];
  };
};

// Executive Training Checklist Detail types
export type ExecutiveTrainingChecklistAttachment = {
  id: number;
  file: string;
  uploaded_at: string;
};

export type ExecutiveTrainingChecklistEmployee = {
  employee_id: number;
  employee_name: string;
  employee_email: string;
  avatar: string | null;
  status: AttachmentStatus;
  status_display: string;
  updated_at: string;
};

export type ExecutiveTrainingChecklistDetail = {
  id: number;
  title: string;
  description: string;
  deadline: string | null;
  attachment: ExecutiveTrainingChecklistAttachment[];
  employees: ExecutiveTrainingChecklistEmployee[];
};

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