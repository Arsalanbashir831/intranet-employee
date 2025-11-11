import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listBranches } from "@/services/branches";
import type { BranchListResponse } from "@/types/branches";
import { useDebounce } from "@/hooks/use-debounce";
import { normalizeParams } from "@/lib/query-utils";
import * as React from "react";

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
	const paramsKey = JSON.stringify(params);
	const paginationKeyValue = JSON.stringify(pagination);
	const normalizedParams = React.useMemo(
		() => normalizeParams(params),
		[params, paramsKey]
	);
	const paginationKey = React.useMemo(
		() => paginationKeyValue,
		[pagination, paginationKeyValue]
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
