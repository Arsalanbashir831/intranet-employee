import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listRoles } from "@/services/roles";
import type { RoleListResponse } from "@/services/roles";
import { useDebounce } from "@/hooks/use-debounce";

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

export function useRoles(
	searchTerm?: string,
	pagination?: { page?: number; pageSize?: number },
	options?: {
		placeholderData?: (
			previousData?: RoleListResponse
		) => RoleListResponse | undefined;
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
		queryKey: ["roles", normalizedParams, paginationKey],
		queryFn: () => listRoles(params, pagination),
		staleTime: 60_000, // Cache for 1 minute
		gcTime: 5 * 60 * 1000, // Keep in memory for 5 minutes
		placeholderData: options?.placeholderData || keepPreviousData,
		enabled: options?.enabled !== undefined ? options.enabled : true,
	});
}
