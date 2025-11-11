import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import { generatePaginationParams } from "@/lib/pagination-utils";
import type {
	DepartmentListResponse,
	BranchDepartmentEmployeesResponse,
} from "@/types/services/departments";

export async function listDepartments(
	params?: Record<string, string | number | boolean>,
	pagination?: { page?: number; pageSize?: number }
) {
	const url = API_ROUTES.DEPARTMENTS.LIST;
	const queryParams: Record<string, string> = {};

	// Add pagination parameters
	if (pagination) {
		const paginationParams = generatePaginationParams(
			pagination.page ? pagination.page - 1 : 0, // Convert to 0-based for our utils
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

	const query =
		Object.keys(queryParams).length > 0
			? `?${new URLSearchParams(queryParams)}`
			: "";

	const res = await apiCaller<DepartmentListResponse>(`${url}${query}`, "GET");
	return res.data;
}

export async function getBranchDepartmentEmployees(
	branchDepartmentId: number | string,
	pagination?: { page?: number; pageSize?: number },
	params?: Record<string, string | number | boolean>
) {
	const url =
		API_ROUTES.DEPARTMENTS.GET_ALL_BRANCH_DEPT_EMPLOYEES(branchDepartmentId);
	const queryParams: Record<string, string> = {};

	// Add search parameters
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			queryParams[key] = String(value);
		});
	}

	// Add pagination parameters
	if (pagination) {
		const paginationParams = generatePaginationParams(
			pagination.page ? pagination.page - 1 : 0,
			pagination.pageSize || 10
		);
		Object.assign(queryParams, paginationParams);
	}

	const query =
		Object.keys(queryParams).length > 0
			? `?${new URLSearchParams(queryParams)}`
			: "";

	const res = await apiCaller<BranchDepartmentEmployeesResponse>(
		`${url}${query}`,
		"GET"
	);
	return res.data;
}
