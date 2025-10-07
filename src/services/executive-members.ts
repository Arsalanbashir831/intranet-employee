import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";

// Executive type definition
export type Executive = {
	id: number;
	name: string;
	address: string;
	city: string;
	phone: string;
	email: string;
	role: string;
	education: string;
	bio?: string;
	branch: string;
	hire_date: string;
	department: string;
	profile_picture?: string | null;
	created_at: string;
	updated_at: string;
};

// Response types
export type ExecutiveListResponse = {
	count: number;
	page: number;
	page_size: number;
	results: Executive[];
};

export type ExecutiveDetailResponse = Executive;

// Form data request type for creating executives
export type ExecutiveCreateRequest = {
	name: string;
	address: string;
	city: string;
	phone: string;
	email: string;
	role: string;
	education: string;
	profile_picture?: File | string | null;
};

// Form data request type for updating executives
export type ExecutiveUpdateRequest = {
	name?: string;
	address?: string;
	city?: string;
	phone?: string;
	email?: string;
	role?: string;
	education?: string;
	profile_picture?: File | string | null; // Support null for removal
};

export async function listExecutives(
	params?: Record<string, string | number | boolean>
) {
	const url = API_ROUTES.EXECUTIVE_MEMBERS.LIST;
	const query = params
		? `?${new URLSearchParams(
				Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
					acc[k] = String(v);
					return acc;
				}, {})
		  )}`
		: "";
	const res = await apiCaller<ExecutiveListResponse>(`${url}${query}`, "GET");
	return res.data;
}

export async function getExecutive(id: number | string) {
	const res = await apiCaller<ExecutiveDetailResponse>(
		API_ROUTES.EXECUTIVE_MEMBERS.DETAIL(id),
		"GET"
	);
	return res.data;
}
