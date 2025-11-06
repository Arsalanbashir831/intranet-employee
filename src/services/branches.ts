import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import { generatePaginationParams } from "@/lib/pagination-utils";

// Branch type definition
export type Branch = {
	id: number;
	branch_name: string;
	employee_count: number;
	departments: BranchDepartment[];
};

export type BranchDepartment = {
	id: number;
	dept_name: string;
	branch_department_id: number;
	employee_count: number;
	manager: {
		id: number;
		employee: {
			id: number;
			emp_name: string;
			profile_picture: string;
			email: string;
			role: string;
			role_id: number;
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
	} | null;
};

export type BranchListResponse = {
	branches: {
		count: number;
		page: number;
		page_size: number;
		results: Branch[];
	};
};

// List branches with search and pagination
export async function listBranches(
	params?: Record<string, string | number | boolean>,
	pagination?: { page?: number; pageSize?: number }
) {
	const url = API_ROUTES.BRANCHES.LIST;
	const queryParams: Record<string, string> = {};

	// Add pagination parameters
	if (pagination) {
		const paginationParams = generatePaginationParams(
			pagination.page ? pagination.page - 1 : 0,
			pagination.pageSize || 10
		);
		Object.assign(queryParams, paginationParams);
	}

	// Add other parameters (like search)
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			queryParams[key] = String(value);
		});
	}

	const query =
		Object.keys(queryParams).length > 0
			? `?${new URLSearchParams(queryParams)}`
			: "";

	const res = await apiCaller<BranchListResponse>(`${url}${query}`, "GET");
	return res.data;
}
