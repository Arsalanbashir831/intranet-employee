import * as React from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  listPolls,
  getPollResults,
  votePoll,
} from "@/services/polls";
import type { PollListResponse, PollResultsResponse, PollVoteResponse } from "@/services/polls";

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
    [JSON.stringify(params)]
  );
  const paginationKey = React.useMemo(
    () => JSON.stringify(pagination),
    [JSON.stringify(pagination)]
  );

  return useQuery({
    queryKey: ["polls", normalizedParams, paginationKey],
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
