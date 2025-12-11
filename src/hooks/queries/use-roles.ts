import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listRoles } from "@/services/roles";
import type { RoleListResponse } from "@/types/roles";
import { useDebounce } from "@/hooks/use-debounce";
import { normalizeParams } from "@/lib/query-utils";

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
		[params]
	);

	return useQuery({
		queryKey: ["roles", normalizedParams, pagination],
		queryFn: () => listRoles(params, pagination),
		staleTime: 60_000, // Cache for 1 minute
		gcTime: 5 * 60 * 1000, // Keep in memory for 5 minutes
		placeholderData: options?.placeholderData || keepPreviousData,
		enabled: options?.enabled !== undefined ? options.enabled : true,
	});
}
