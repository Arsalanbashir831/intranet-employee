/**
 * Knowledge Base utility functions
 */

import type { FolderTreeItem, FolderTreeFile, KnowledgeBaseRow } from "@/types/knowledge-base";
import { getApiBaseUrl } from "./utils";

/**
 * Convert a folder tree item to a knowledge base table row
 */
export function convertFolderToRow(folder: FolderTreeItem): KnowledgeBaseRow {
	return {
		id: String(folder.id),
		folder: folder.name,
		createdByName: folder.created_by?.emp_name || "Admin",
		createdByAvatar: folder.created_by?.profile_picture 
			? getApiBaseUrl() + folder.created_by.profile_picture 
			: undefined,
		dateCreated: folder.created_at,
		type: "folder",
		createdBy: folder.created_by,
	};
}

/**
 * Convert a folder tree file to a knowledge base table row
 */
export function convertFileToRow(file: FolderTreeFile): KnowledgeBaseRow {
	return {
		id: String(file.id),
		folder: file.name,
		createdByName: "",
		dateCreated: file.uploaded_at || "",
		type: "file",
		fileUrl: file.file_url,
	};
}

