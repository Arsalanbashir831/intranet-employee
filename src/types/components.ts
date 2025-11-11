/**
 * Component-specific types
 */

// Comment component type (different from API Comment type)
export interface Comment {
	id: string;
	author: {
		name: string;
		avatar?: string;
		role?: string;
		department?: string;
	};
	content: string;
	createdAt: string;
	isEdited?: boolean;
	replies?: Comment[];
	isExpanded?: boolean;
	canEdit?: boolean;
	canDelete?: boolean;
	replyCount?: number;
}

// Knowledge Base Table types
export type KnowledgeBaseRow = {
	id: string;
	folder: string;
	createdByName: string;
	createdByAvatar?: string;
	dateCreated: string; // YYYY-MM-DD
	type?: "folder" | "file";
	fileUrl?: string;
	createdBy?: {
		id: number | null;
		emp_name: string;
		email: string | null;
		phone: string | null;
		role: string | null;
		profile_picture: string | null;
		branch_department_ids: number[];
		is_admin: boolean;
	};
};

