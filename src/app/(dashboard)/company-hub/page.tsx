"use client";

import { PageHeader } from "@/components/common/page-header";
import FeatureCard from "@/components/common/feature-card";
import { ROUTES } from "@/constants/routes";

import { useState, useMemo, useEffect } from "react";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { CardTableToolbar } from "@/components/common/card-table/card-table-toolbar";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAnnouncements } from "@/hooks/queries/use-announcements";
import { useAuth } from "@/contexts/auth-context";
import { calculateTotalPages } from "@/lib/pagination-utils";

/* ---------------- Types ---------------- */
interface CompanyHubItem {
	id: string;
	title: string;
	description: string;
}
interface Announcement extends CompanyHubItem {
	image: string;
	badgeLines: [string, string, string];
	createdAt: string;
}
type Policy = CompanyHubItem;

/* ---------------- Table scaffold (for pagination UI) ---------------- */
const columnHelper = createColumnHelper<CompanyHubItem>();
const columns = [
	columnHelper.accessor("id", {
		cell: (info) => info.getValue(),
		header: () => <span>ID</span>,
	}),
	columnHelper.accessor("title", {
		cell: (info) => info.getValue(),
		header: () => <span>Title</span>,
	}),
	columnHelper.accessor("description", {
		cell: (info) => info.getValue(),
		header: () => <span>Description</span>,
	}),
];

/* ---------------- Page ---------------- */
export default function CompanyHub() {
	const search = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const { user } = useAuth();

	const urlTab =
		(search.get("tab") as "announcements" | "policies") ?? "announcements";
	const [activeTab, setActiveTab] = useState<"announcements" | "policies">(
		urlTab
	);

	useEffect(() => {
		const next =
			(search.get("tab") as "announcements" | "policies") ?? "announcements";
		if (next !== activeTab) setActiveTab(next);
	}, [search, activeTab]);

	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);

	// Figma-like: 4 across on xl; 2 across on lg; 1 on small → page size 8 (2 rows of 4)
	const pageSize = 8;

	// Fetch announcements data with caching
	const {
		data: announcementsData,
		isLoading: announcementsLoading,
		isFetching: announcementsFetching,
	} = useAnnouncements(
		user?.employeeId
			? {
					type: "announcement",
					employee_id: user.employeeId,
			  }
			: undefined,
		{ page, pageSize }
	);

	// Fetch policies data with caching
	const {
		data: policiesData,
		isLoading: policiesLoading,
		isFetching: policiesFetching,
	} = useAnnouncements(
		user?.employeeId
			? {
					type: "policy",
					employee_id: user.employeeId,
			  }
			: undefined,
		{ page, pageSize }
	);

	const dataSource: CompanyHubItem[] =
		activeTab === "announcements"
			? (announcementsData?.announcements.results.map((announcement) => ({
					id: announcement.id.toString(),
					title: announcement.title,
					description:
						announcement.body.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
					image:
						announcement.attachments.length > 0
							? announcement.attachments[0].file_url
							: "/images/office-work.png",
					badgeLines: [
						new Date(announcement.created_at).getDate().toString(),
						new Date(announcement.created_at).toLocaleString("default", {
							month: "short",
						}),
						new Date(announcement.created_at).getFullYear().toString(),
					] as [string, string, string],
					createdAt: announcement.created_at,
			  })) as Announcement[]) || []
			: (policiesData?.announcements.results.map((policy) => ({
					id: policy.id.toString(),
					title: policy.title,
					description:
						policy.body.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
			  })) as Policy[]) || [];

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return q
			? dataSource.filter((a) => a.title.toLowerCase().includes(q))
			: dataSource;
	}, [query, dataSource]);

	const announcementsCount = announcementsData?.announcements.count || 0;
	const policiesCount = policiesData?.announcements.count || 0;

	const pageCount =
		activeTab === "announcements"
			? Math.max(1, calculateTotalPages(announcementsCount, pageSize))
			: Math.max(1, calculateTotalPages(policiesCount, pageSize));

	const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

	const table = useReactTable<CompanyHubItem>({
		data: filtered,
		columns,
		getCoreRowModel: getCoreRowModel(),
		pageCount,
		state: {
			pagination: {
				pageIndex: page - 1, // Convert to 0-based for react-table
				pageSize,
			},
		},
		onPaginationChange: (updater) => {
			// Convert back to 1-based pagination for our API
			if (typeof updater === "function") {
				const newState = updater({
					pageIndex: page - 1,
					pageSize,
				});
				setPage(newState.pageIndex + 1);
			} else {
				setPage(updater.pageIndex + 1);
			}
		},
	});

	const handleSearchChange = (value: string) => {
		setQuery(value);
		setPage(1);
	};
	const handleSortChange = () => setPage(1);

	const handleTabChange = (tabKey: string) => {
		const t = tabKey as "announcements" | "policies";
		setActiveTab(t);
		setPage(1);
		setQuery("");
		const qs = new URLSearchParams(search.toString());
		qs.set("tab", t);
		router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
	};

	// Show loading state only for the initial load of each tab
	const showLoading =
		(activeTab === "announcements" &&
			!announcementsData &&
			(announcementsLoading || announcementsFetching)) ||
		(activeTab === "policies" &&
			!policiesData &&
			(policiesLoading || policiesFetching));

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<PageHeader
				title="Company Hub"
				crumbs={[
					{ label: "Pages", href: "#" },
					{ label: "Company Hub", href: ROUTES.DASHBOARD.COMPANY_HUB },
				]}
				tabs={[
					{ key: "announcements", label: "Announcements" },
					{ key: "policies", label: "Policies" },
				]}
				activeTab={activeTab}
				onTabChange={handleTabChange}
			/>

			{/* Page rails + top/bottom breathing room */}
			<main className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
				{/* White panel with equal padding on every side */}
				<section className="bg-white rounded-2xl shadow-sm p-6 sm:p-6 lg:p-5">
					{/* Keep internal vertical rhythm consistent */}
					<div className="space-y-6">
						{/* Toolbar (no margins here) */}
						<CardTableToolbar
							title={
								activeTab === "announcements" ? "Announcements" : "Policies"
							}
							placeholder="Search"
							onSearchChange={handleSearchChange}
							onSortChange={handleSortChange}
							sortOptions={[
								{ label: "Title", value: "title" },
								{ label: "Date", value: "date" },
							]}
							activeSort="title"
							className="flex sm:flex-col sm:items-start"
						/>

						{/* Grid with equal gutters */}
						<div className="grid auto-rows-fr min-w-0 grid-cols-1 sm:grid-cols lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-stretch xl:justify-items-center">
							{showLoading ? (
								<div className="col-span-full flex justify-center py-8">
									<div>Loading {activeTab}...</div>
								</div>
							) : pageItems.length > 0 ? (
								pageItems.map((item) =>
									activeTab === "announcements" ? (
										<FeatureCard
											key={item.id}
											link={`${ROUTES.DASHBOARD.COMPANY_HUB}/${item.id}`}
											image={(item as Announcement).image}
											title={item.title}
											description={item.description}
											badgeLines={(item as Announcement).badgeLines}
											className="w-full"
											imgClassName="object-cover"
										/>
									) : (
										<FeatureCard
											key={item.id}
											link={`${ROUTES.DASHBOARD.COMPANY_HUB}/${item.id}`}
											title={item.title}
											description={item.description}
											className="w-full"
											imgClassName="object-cover"
										/>
									)
								)
							) : (
								<div className="col-span-full text-center py-8">
									<p>No {activeTab} found.</p>
								</div>
							)}
							{/* keep full rows on last page (optional) */}
							{Array.from({
								length: Math.max(0, pageSize - pageItems.length),
							}).map((_, i) => (
								<div key={`spacer-${i}`} className="hidden xl:block" />
							))}
						</div>

						{/* Pagination aligned right with the same vertical spacing as above */}
						{pageItems.length > 0 && (
							<div className="flex items-center justify-end">
								<CardTablePagination table={table} />
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}
