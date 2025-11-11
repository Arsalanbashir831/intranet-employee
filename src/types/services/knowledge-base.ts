/**
 * Knowledge base service types
 */

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
	created_by: {
		id: number | null;
		emp_name: string;
		email: string | null;
		phone: string | null;
		role: string | null;
		profile_picture: string | null;
		branch_department_ids: number[];
		is_admin: boolean;
	};
	access_level: {
		branches: number[];
		departments: number[];
		branch_departments: number[];
		employees: number[];
	};
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

