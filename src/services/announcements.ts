import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import { generatePaginationParams } from "@/lib/pagination-utils";
import type {
	AnnouncementListResponse,
	AnnouncementDetailResponse,
} from "@/types/announcements";

// Announcement CRUD operations (read-only for employee application)
export async function listAnnouncements(
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  const url = API_ROUTES.KNOWLEDGE_BASE.ANNOUNCEMENTS.LIST;
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
  const url = API_ROUTES.KNOWLEDGE_BASE.ANNOUNCEMENTS.ATTACHMENTS;
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