import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";
import type {
	ExecutiveListResponse,
	ExecutiveDetailResponse,
} from "@/types/executive-members";

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
