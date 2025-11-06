import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listBranches } from "@/services/branches";
import type { BranchListResponse } from "@/services/branches";
import { useDebounce } from "@/hooks/use-debounce";
import * as React from "react";

// Helper to create stable query keys
const normalizeParams = (
	params?: Record<string, string | number | boolean>
) => {
	if (!params) return undefined;
	// Sort keys to ensure consistent query key ordering
	const entries = Object.entries(params).sort(([a], [b]) => (a > b ? 1 : -1));
	return Object.fromEntries(entries) as Record<
		string,
		string | number | boolean
	>;
};

export function useBranches(
	searchTerm?: string,
	pagination?: { page?: number; pageSize?: number },
	options?: {
		placeholderData?: (
			previousData?: BranchListResponse
		) => BranchListResponse | undefined;
		enabled?: boolean;
	}
) {
	// Debounce search term
	const debouncedSearch = useDebounce(searchTerm || "", 400);

	// Build params object
	const params = React.useMemo(() => {
		const p: Record<string, string | number | boolean> = {};
		if (debouncedSearch) {
			p.search = debouncedSearch;
		}
		return p;
	}, [debouncedSearch]);

	// Normalize params to ensure consistent query keys
	const normalizedParams = React.useMemo(
		() => normalizeParams(params),
		[JSON.stringify(params)]
	);
	const paginationKey = React.useMemo(
		() => JSON.stringify(pagination),
		[JSON.stringify(pagination)]
	);

	return useQuery({
		queryKey: ["branches", normalizedParams, paginationKey],
		queryFn: () => listBranches(params, pagination),
		staleTime: 60_000, // Cache for 1 minute
		gcTime: 5 * 60 * 1000, // Keep in memory for 5 minutes
		placeholderData: options?.placeholderData || keepPreviousData,
		enabled: options?.enabled !== undefined ? options.enabled : true,
	});
}
