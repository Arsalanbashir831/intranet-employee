import { useQuery } from "@tanstack/react-query";
import {
	listExecutives,
	getExecutive,
	type ExecutiveListResponse,
	type ExecutiveDetailResponse,
} from "@/services/executive-members";

export function useExecutives(
	params?: Record<string, string | number | boolean>
) {
	return useQuery<ExecutiveListResponse>({
		queryKey: ["executives", params],
		queryFn: () => listExecutives(params),
		staleTime: 60_000,
		refetchOnWindowFocus: false,
		placeholderData: (previousData: ExecutiveListResponse | undefined) =>
			previousData, // Keep previous data while fetching
	});
}

export function useExecutive(id: number | string) {
	return useQuery<ExecutiveDetailResponse>({
		queryKey: ["executives", id],
		queryFn: () => getExecutive(id),
		enabled: !!id,
		staleTime: 60_000,
	});
}
