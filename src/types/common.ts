/**
 * Common shared types used across the application
 */

// Pagination types (moved from lib/pagination-utils.ts)
export interface PaginationInfo {
	count: number;
	page: number;
	page_size: number;
}

export interface PaginationState {
	pageIndex: number;
	pageSize: number;
}

// Branch types (consolidated from branches.ts and departments.ts)
export type Branch = {
	id: number;
	branch_name: string;
	employee_count?: number;
	departments?: BranchDepartment[];
};

export type BranchDepartment = {
	id: number;
	branch: Branch;
	employee_count: number;
	manager: null | {
		id: number;
		employee: {
			id: number;
			emp_name: string;
			profile_picture?: string | null;
			email: string;
			role: string;
		};
		branch_department: {
			id: number;
			branch: {
				id: number;
				branch_name: string;
			};
			department: {
				id: number;
				dept_name: string;
			};
		};
	};
};

