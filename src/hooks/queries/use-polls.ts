import * as React from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  listPolls,
  getPollResults,
  votePoll,
} from "@/services/polls";
import type { PollListResponse } from "@/types/polls";
import { normalizeParams } from "@/lib/query-utils";

export function usePolls(
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number },
  options?: {
    placeholderData?: (
      previousData?: PollListResponse
    ) => PollListResponse | undefined;
    enabled?: boolean;
  }
) {
  // Normalize params to ensure consistent query keys
  const normalizedParams = React.useMemo(
    () => normalizeParams(params),
    [params]
  );

  return useQuery({
    queryKey: ["polls", normalizedParams, pagination],
    queryFn: () => {
      return listPolls(params, pagination);
    },
    staleTime: 60_000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in memory for 5 minutes
    placeholderData: options?.placeholderData || keepPreviousData, // Keep previous data while fetching
    enabled: options?.enabled !== undefined ? options.enabled : true, // Enable by default
  });
}

export function usePollResults(id: number | string) {
  return useQuery({
    queryKey: ["poll-results", String(id)],
    queryFn: () => getPollResults(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useVotePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pollId, optionId }: { pollId: number | string; optionId: number }) =>
      votePoll(pollId, optionId),
    onSuccess: (data, variables) => {
      // Invalidate and refetch poll results
      queryClient.invalidateQueries({
        queryKey: ["poll-results", String(variables.pollId)],
      });
      // Invalidate polls list to update vote counts
      queryClient.invalidateQueries({
        queryKey: ["polls"],
      });
    },
    onError: (error) => {
      console.error("Vote failed:", error);
    },
  });
}
