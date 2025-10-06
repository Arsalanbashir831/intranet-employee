import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";

export type FolderTreeFile = {
  id: number;
  folder: number;
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

export type FolderTreeItem = {
  id: number;
  name: string;
  description: string;
  parent: number | null;
  inherits_parent_permissions: boolean;
  created_at: string;
  effective_permissions: {
    branches: number[];
    departments: number[];
    employees: number[];
  };
  files: FolderTreeFile[];
  folders: FolderTreeItem[]; // Recursive type for nested folders
};

export type FolderTreeResponse = {
  folders: FolderTreeItem[];
};

// Service functions
// Note: Only the folder tree API is available, other endpoints are not implemented in the backend

/*
 * getAllFolders, searchFolders, getFolders, and getFolder functions are not available
 * because the backend only provides the folder tree API.
 * These functions are kept here for documentation purposes but will not work.
 */

// export async function getAllFolders(): Promise<FolderListResponse> {
//   // This function is not available because there's no LIST endpoint
//   // We can only get folders through the tree API
//   throw new Error("getAllFolders not available - use getFolderTree instead");
// }

// export async function searchFolders(params?: Record<string, string | number | boolean>): Promise<FolderListResponse> {
//   // This function is not available because there's no SEARCH endpoint
//   // We can only get folders through the tree API
//   throw new Error("searchFolders not available - use getFolderTree instead");
// }

// export async function getFolders(params?: FolderListParams): Promise<FolderListResponse> {
//   // This function is not available because there's no LIST endpoint
//   // We can only get folders through the tree API
//   throw new Error("getFolders not available - use getFolderTree instead");
// }

// export async function getFolder(id: number | string): Promise<FolderDetailResponse> {
//   // This function is not available because there's no DETAIL endpoint
//   // We can only get folders through the tree API
//   throw new Error("getFolder not available - use getFolderTree instead");
// }

export async function getFolderTree(employeeId?: number | string) {
  try {
    let url = API_ROUTES.KNOWLEDGE_BASE.FOLDERS.FOLDER_TREE;
    if (employeeId) {
      url += `?employee_id=${employeeId}`;
    }
    
    const res = await apiCaller<FolderTreeResponse>(url, "GET");
    return res.data;
  } catch (error) {
    console.error("Error fetching folder tree:", error);
    throw error;
  }
}