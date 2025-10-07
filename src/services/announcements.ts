import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";

// Define types based on the API response
export type Announcement = {
  id: number;
  title: string;
  body: string;
  type: string;
  hash_tags: string | null;
  is_active: boolean;
  inherits_parent_permissions: boolean;
  permitted_branches: number[];
  permitted_departments: number[];
  permitted_employees: number[];
  created_by: number | null;
  created_at: string;
  updated_at: string;
  attachments: AnnouncementAttachment[];
  effective_permissions: {
    branches: number[];
    departments: number[];
    employees: number[];
  };
  permitted_branches_details: Array<{ id: number; branch_name: string; location: string | null }>;
  permitted_departments_details: Array<{ id: number; dept_name: string }>;
  permitted_employees_details: Array<{ 
    id: number; 
    emp_name: string; 
    email: string; 
    phone: string;
    role: string;
    profile_picture: string | null;
  }>;
  created_by_details: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
  } | null;
};

export type AnnouncementAttachment = {
  id: number;
  announcement: number;
  name: string;
  description: string;
  file: string;
  file_url: string;
  inherits_parent_permissions: boolean;
  permitted_branches: number[];
  permitted_departments: number[];
  permitted_employees: number[];
  uploaded_by: number | null;
  uploaded_at: string;
  size: number;
  content_type: string;
  effective_permissions: {
    branches: number[];
    departments: number[];
    employees: number[];
  };
};

export type AnnouncementListResponse = {
  announcements: {
    count: number;
    page: number;
    page_size: number;
    results: Announcement[];
  };
};
export type AnnouncementDetailResponse = Announcement;

// Announcement CRUD operations (read-only for employee application)
export async function listAnnouncements(
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  const url = API_ROUTES.KNOWLEDGE_BASE.ANNOUNCEMENTS.LIST;
  const queryParams: Record<string, string> = {};
  
  // Add pagination parameters
  if (pagination) {
    // Convert 1-based page number to 1-based for API (no conversion needed)
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
  
  const query = Object.keys(queryParams).length > 0 
    ? `?${new URLSearchParams(queryParams)}` 
    : "";
    
  const res = await apiCaller<AnnouncementListResponse>(`${url}${query}`, "GET");
  return res.data;
}

export async function getAnnouncement(id: number | string) {
  const res = await apiCaller<AnnouncementDetailResponse>(
    API_ROUTES.KNOWLEDGE_BASE.ANNOUNCEMENTS.DETAIL(id), 
    "GET"
  );
  return res.data;
}

// Function to get latest announcements for a specific employee
export async function getLatestAnnouncements(employeeId: number, limit: number = 5) {
  const params = {
    type: 'announcement',
    page: 1,
    page_size: limit,
    employee_id: employeeId
  };
  
  return listAnnouncements(params);
}

// Function to get latest policies for a specific employee
export async function getLatestPolicies(employeeId: number, limit: number = 3) {
  const params = {
    type: 'policy',
    page: 1,
    page_size: limit,
    employee_id: employeeId
  };
  
  return listAnnouncements(params);
}

// Announcement Attachment operations (read-only for employee application)
export async function listAnnouncementAttachments(
  announcementId: number | string,
  params?: Record<string, string | number | boolean>
) {
  const url = "/knowledge/announcement-attachments/";
  const queryParams: Record<string, string> = {
    announcement: String(announcementId)
  };
  
  // Add other parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      queryParams[key] = String(value);
    });
  }
  
  const query = `?${new URLSearchParams(queryParams)}`;
    
  const res = await apiCaller<AnnouncementListResponse>(`${url}${query}`, "GET");
  return res.data;
}