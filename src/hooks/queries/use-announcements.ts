import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
	getAnnouncement,
	listAnnouncements,
	listAnnouncementAttachments,
	getLatestAnnouncements,
	getLatestPolicies,
} from "@/services/announcements";
import type { AnnouncementListResponse } from "@/services/announcements";

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

export function useAnnouncements(
	params?: Record<string, string | number | boolean>,
	pagination?: { page?: number; pageSize?: number },
	options?: {
		placeholderData?: (
			previousData?: AnnouncementListResponse
		) => AnnouncementListResponse | undefined;
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
		queryKey: ["announcements", normalizedParams, paginationKey],
		queryFn: () => {
			// Always include inactive announcements (drafts) in the results
			const queryParams = {
				...params,
				// include_inactive: true
			};
			return listAnnouncements(queryParams, pagination);
		},
		staleTime: 60_000, // Cache for 1 minute
		gcTime: 5 * 60 * 1000, // Keep in memory for 5 minutes
		placeholderData: options?.placeholderData || keepPreviousData, // Keep previous data while fetching
		enabled: options?.enabled !== undefined ? options.enabled : true, // Enable by default
	});
}

export function useAnnouncement(id: number | string) {
	return useQuery({
		queryKey: ["announcements", String(id)],
		queryFn: () => getAnnouncement(id),
		enabled: !!id,
		staleTime: 60_000,
	});
}

// New hook for fetching latest announcements for a specific employee
export function useLatestAnnouncements(employeeId: number, limit: number = 5) {
	return useQuery({
		queryKey: ["latest-announcements", employeeId, limit],
		queryFn: () => getLatestAnnouncements(employeeId, limit),
		enabled: !!employeeId,
		staleTime: 60_000,
	});
}

// New hook for fetching latest policies for a specific employee
export function useLatestPolicies(employeeId: number, limit: number = 3) {
	return useQuery({
		queryKey: ["latest-policies", employeeId, limit],
		queryFn: () => getLatestPolicies(employeeId, limit),
		enabled: !!employeeId,
		staleTime: 60_000,
	});
}

// Announcement Attachment hooks
export function useAnnouncementAttachments(
	announcementId: number | string,
	params?: Record<string, string | number | boolean>
) {
	const normalizedParams = React.useMemo(
		() => normalizeParams(params),
		[JSON.stringify(params)]
	);

	return useQuery({
		queryKey: [
			"announcement-attachments",
			String(announcementId),
			normalizedParams,
		],
		queryFn: () => listAnnouncementAttachments(announcementId, params),
		enabled: !!announcementId,
		staleTime: 60_000,
	});
}
