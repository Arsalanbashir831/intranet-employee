import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import { generatePaginationParams } from "@/lib/pagination-utils";

// Role type definition
export type Role = {
	id: number;
	name: string;
	is_manager: boolean;
	is_executive: boolean;
};

export type RoleListResponse = {
	roles: {
		count: number;
		page: number;
		page_size: number;
		results: Role[];
	};
};

// List roles with search and pagination
export async function listRoles(
	params?: Record<string, string | number | boolean>,
	pagination?: { page?: number; pageSize?: number }
) {
	const url = API_ROUTES.ROLES.LIST;
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

	const res = await apiCaller<RoleListResponse>(`${url}${query}`, "GET");
	return res.data;
}
