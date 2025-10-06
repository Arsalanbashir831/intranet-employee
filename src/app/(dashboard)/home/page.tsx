// app/(dashboard)/home/page.tsx
"use client";

import BannerSection from "@/components/common/banner-section";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import Checklist from "@/components/common/checklist";
import QuickAccess from "@/components/common/quick-access";
import TeamSection from "@/components/teams/team-section";
import RecentPolicies from "@/components/common/recent-policies";
import KnowledgeBaseTable from "@/components/knowledge-base/knowledge-base-table";
import ContactSection from "@/components/common/contact-section";
import { LatestAnnouncements } from "@/components/dashboard/latest-announcements";
import { useKnowledgeFolders } from "@/hooks/queries/use-knowledge-folders";
import { useState } from "react";
import { PaginationState, pageIndexToPageNumber } from "@/lib/pagination-utils";
import { KnowledgeBaseRow } from "@/components/knowledge-base/knowledge-base-table";
import { FolderTreeItem } from "@/services/knowledge-folders";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	});
	
	const { data, isLoading, isError } = useKnowledgeFolders(
		pageIndexToPageNumber(pagination.pageIndex),
		pagination.pageSize
	);
	
	// Convert API folder data to table row format
	const convertFolderToRow = (folder: FolderTreeItem): KnowledgeBaseRow => ({
		id: folder.id.toString(),
		folder: folder.name,
		createdByName: "Cartwright King",
		createdByAvatar: "/images/logo-circle.png",
		dateCreated: new Date(folder.created_at).toISOString().split('T')[0],
		type: "folder",
	});
	
	// Transform API data to table rows
	const tableData = data?.folders?.results?.map(convertFolderToRow) || [];
	
	const handlePaginationChange = (newPagination: PaginationState) => {
		setPagination(newPagination);
	};

	// Handle row click to navigate to knowledge base
	const handleRowClick = (row: KnowledgeBaseRow) => {
		if (row.type === "folder") {
			// Navigate to the folder in knowledge base
			router.push(`${ROUTES.DASHBOARD.KNOWLEDGE_BASE}/${encodeURIComponent(row.folder)}`);
		}
		// Note: Since these are top-level folders, there won't be files to download directly from home page
	};

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<BannerSection />
			<PageHeader
				title="Home"
				crumbs={[
					{ label: "Pages", href:'#' },
					{ label: "Home", href: ROUTES.DASHBOARD.HOME },
				]}
			/>

			{/* one gutter to rule them all */}
			<main
				className=" mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10 [--gap:1rem] sm:[--gap:1.125rem] lg:[--gap:1.25rem] max-w-[110rem] min-[2560px]:max-w-[140rem] space-y-[calc(var(--gap)*1.25)]">
				{/* ============ Announcements (desktop = horizontal scroll) ============ */}
				<LatestAnnouncements />

				{/* ======================= Bottom area ======================= */}
				<section className="pb-[calc(var(--gap)*1.5)]">
					<div
						className="grid w-full grid-cols-1 md:grid-cols-[390px_minmax(0,1fr)]
            gap-[var(--gap)]">
						{/* Left column */}
						<div className="flex flex-col gap-[calc(var(--gap)*0.9)] w-full">
							<Checklist
								title="Task Checklist"
								viewMoreLink="/task-checklist"
								tasks={[
									"Follow the instructions and report everything properly",
									"Complete all assigned tasks on time",
									"Attend the scheduled team meeting promptly",
									"Update the documentation as per guidelines",
									"Submit the weekly report before Friday",
								]}
							/>
							<Checklist
								title="Training Checklist"
								viewMoreLink="/training-checklist"
								tasks={[
									"Follow the instructions and report everything properly",
									"Complete all assigned tasks on time",
									"Attend the scheduled team meeting promptly",
									"Update the documentation as per guidelines",
									"Submit the weekly report before Friday",
								]}
							/>
							{/* keep your contact block */}
							<div>
								{/* ContactSection keeps its own padding */}
								<ContactSection />
							</div>
						</div>

						{/* Right column */}
						<div className="flex flex-col gap-[calc(var(--gap)*0.9)] w-full">
							<div className="w-full">
								<QuickAccess />
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--gap)] auto-rows-fr">
								<section className="w-full overflow-hidden rounded-xl">
									<TeamSection />
								</section>
								<section className="w-full overflow-hidden rounded-xl">
									<RecentPolicies />
								</section>
							</div>

							{/* Knowledge Base */}
							<div className="w-full">
								<div className="rounded-xl h-auto overflow-hidden">
									{isLoading ? (
										<div className="bg-[#F9FFFF] p-4 sm:p-5 md:p-5 rounded-xl">
											<div className="animate-pulse space-y-3">
												<div className="h-6 bg-gray-200 rounded w-1/4"></div>
												<div className="space-y-2">
													{Array.from({ length: 5 }).map((_, i) => (
														<div key={i} className="h-12 bg-gray-100 rounded"></div>
													))}
												</div>
											</div>
										</div>
									) : isError ? (
										<div className="bg-[#F9FFFF] p-4 sm:p-5 md:p-5 rounded-xl">
											<div className="text-red-500">Failed to load knowledge base data</div>
										</div>
									) : (
										<KnowledgeBaseTable
											data={tableData}
											showToolbar={false}
											viewMoreHref="/knowledge-base"
											baseHref="/knowledge-base"
											className="bg-[#F9FFFF] gap-0 w-full"
											onRowClick={handleRowClick} // Add row click handler
											pagination={{
												pageIndex: pagination.pageIndex,
												pageSize: pagination.pageSize,
												totalCount: data?.folders?.count || 0,
												onPaginationChange: handlePaginationChange,
											}}
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}