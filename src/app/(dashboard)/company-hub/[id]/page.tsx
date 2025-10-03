"use client";

import React from "react";
import AnnouncementDetailCard from "@/components/company-hub/announcement-details";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import { useAnnouncement } from "@/hooks/queries/use-announcements";
import { useParams } from "next/navigation";

export default function CompanySlug() {
	const params = useParams();
	const id = params.id as string;
	
	const { data: announcementData, isLoading, isError, error } = useAnnouncement(id);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Loading announcement...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Error loading announcement: {error?.message || 'Unknown error'}</div>
			</div>
		);
	}

	if (!announcementData) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Announcement not found.</div>
			</div>
		);
	}

	return (
		<div>
			<PageHeader
				title="Company Hub"
				crumbs={[
					{ label: "Pages", href:'#' },
					{ label: "Company Hub", href: ROUTES.DASHBOARD.COMPANY_HUB },
					{ label: announcementData.title }
				]}
			/>

			<AnnouncementDetailCard announcement={announcementData} />
		</div>
	);
}