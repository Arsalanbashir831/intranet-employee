import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import type {
	FolderTreeResponse,
} from "@/types/services/knowledge-base";

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