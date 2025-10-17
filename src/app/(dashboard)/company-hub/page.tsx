"use client";

import { PageHeader } from "@/components/common/page-header";
import FeatureCard from "@/components/common/feature-card";
import PollCard from "@/components/common/poll-card";
import { ROUTES } from "@/constants/routes";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { CardTableToolbar } from "@/components/common/card-table/card-table-toolbar";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAnnouncements } from "@/hooks/queries/use-announcements";
import { usePolls } from "@/hooks/queries/use-polls";
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

interface PollOption {
	id: string;
	text: string;
	votes: number;
	percentage: number;
}

interface Poll extends CompanyHubItem {
	question: string;
	options: PollOption[];
	totalVotes: number;
	isActive: boolean;
	expiresAt: string;
	createdAt: string;
	userVoted?: boolean;
	userVoteOptionId?: string;
	badgeLines: [string, string, string];
}

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
		(search.get("tab") as "announcements" | "policies" | "polls") ?? "announcements";
	const [activeTab, setActiveTab] = useState<"announcements" | "policies" | "polls">(
		urlTab
	);

	useEffect(() => {
		const next =
			(search.get("tab") as "announcements" | "policies" | "polls") ?? "announcements";
		if (next !== activeTab) setActiveTab(next);
	}, [search, activeTab]);

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 400);
	const [page, setPage] = useState(1);
	const [sort, setSort] = useState<string>("title");

	// Figma-like: 4 across on xl; 2 across on lg; 1 on small → page size 8 (2 rows of 4)
	const pageSize = 8;


	// Fetch announcements data (no server-side sorting)
	const {
		data: announcementsData,
		isLoading: announcementsLoading,
		isFetching: announcementsFetching,
	} = useAnnouncements(
		{
			...(user?.employeeId ? { employee_id: user.employeeId } : {}),
			type: "announcement",
			search: debouncedQuery.trim() ? debouncedQuery.trim() : "",
		},
		{ page, pageSize }
	);

	// Fetch policies data (no server-side sorting)
	const {
		data: policiesData,
		isLoading: policiesLoading,
		isFetching: policiesFetching,
	} = useAnnouncements(
		{
			...(user?.employeeId ? { employee_id: user.employeeId } : {}),
			type: "policy",
			search: debouncedQuery.trim() ? debouncedQuery.trim() : "",
		},
		{ page, pageSize }
	);

	// Fetch polls data
	const {
		data: pollsData,
		isLoading: pollsLoading,
		isFetching: pollsFetching,
	} = usePolls(
		{
			manager_scope: false,
			include_expired: true,
			search: debouncedQuery.trim() ? debouncedQuery.trim() : "",
		},
		{ page, pageSize }
	);

	// Build dataSource and sort client-side
	let dataSource: CompanyHubItem[] = [];
	if (activeTab === "announcements") {
		dataSource =
			(announcementsData?.announcements.results.map((announcement) => ({
				id: announcement.id.toString(),
				title: announcement.title,
				description:
					announcement.body.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
				image:
					announcement.attachments.length > 0
						? announcement.attachments[0].file_url
						: "/logos/profile-circle.svg",
				badgeLines: [
					new Date(announcement.created_at).getDate().toString(),
					new Date(announcement.created_at).toLocaleString("default", {
						month: "short",
					}),
					new Date(announcement.created_at).getFullYear().toString(),
				] as [string, string, string],
				createdAt: announcement.created_at,
			})) as Announcement[]) || [];
	} else if (activeTab === "policies") {
		dataSource =
			(policiesData?.announcements.results.map((policy) => ({
				id: policy.id.toString(),
				title: policy.title,
				description:
					policy.body.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
			})) as Policy[]) || [];
	} else if (activeTab === "polls") {
		// Transform API polls data to match component interface
		dataSource = (pollsData?.polls.results.map((poll) => ({
			id: poll.id.toString(),
			title: poll.title,
			description: poll.subtitle || poll.question,
			question: poll.question,
			options: poll.options.map(option => ({
				id: option.id.toString(),
				text: option.option_text,
				votes: option.vote_count,
				percentage: poll.total_votes > 0 ? Math.round((option.vote_count / poll.total_votes) * 100) : 0
			})),
			totalVotes: poll.total_votes,
			isActive: poll.is_active && !poll.is_expired,
			expiresAt: poll.expires_at,
			createdAt: poll.created_at,
			userVoted: poll.has_voted,
			userVoteOptionId: poll.user_vote?.toString(),
			badgeLines: [
				new Date(poll.created_at).getDate().toString(),
				new Date(poll.created_at).toLocaleString("default", { month: "short" }),
				new Date(poll.created_at).getFullYear().toString()
			] as [string, string, string]
		})) as Poll[]) || [];
	}

	// Client-side sorting
	const sortKey = sort === "created_at" ? "createdAt" : "title";
	const sorted = [...dataSource].sort((a, b) => {
		const av =
			sortKey === "createdAt" ? (a as Announcement).createdAt ?? "" : a.title;
		const bv =
			sortKey === "createdAt" ? (b as Announcement).createdAt ?? "" : b.title;
		return String(av).localeCompare(String(bv));
	});

	const filtered = sorted;

	const announcementsCount = announcementsData?.announcements.count || 0;
	const policiesCount = policiesData?.announcements.count || 0;
	const pollsCount = pollsData?.polls.count || 0;

	const pageCount =
		activeTab === "announcements"
			? Math.max(1, calculateTotalPages(announcementsCount, pageSize))
			: activeTab === "policies"
			? Math.max(1, calculateTotalPages(policiesCount, pageSize))
			: Math.max(1, calculateTotalPages(pollsCount, pageSize));

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
	const handleSortChange = (value: string) => {
		setSort(value);
		setPage(1);
	};

	const handleTabChange = (tabKey: string) => {
		const t = tabKey as "announcements" | "policies" | "polls";
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
			(policiesLoading || policiesFetching)) ||
		(activeTab === "polls" &&
			!pollsData &&
			(pollsLoading || pollsFetching));

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
					{ key: "polls", label: "Polls" },
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
								activeTab === "announcements" 
									? "Announcements" 
									: activeTab === "policies" 
									? "Policies" 
									: "Polls"
							}
							placeholder="Search"
							searchValue={query}
							onSearchChange={handleSearchChange}
							onSortChange={handleSortChange}
							sortOptions={[
								{ label: "Title", value: "title" },
								{ label: "Date", value: "created_at" },
							]}
							hasFilter={false}
							activeSort={sort}
							className="flex sm:flex-col sm:items-start"
						/>


						{/* Grid with equal gutters */}
						<div className="grid auto-rows-fr min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-stretch">
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
									) : activeTab === "policies" ? (
										<FeatureCard
											key={item.id}
											link={`${ROUTES.DASHBOARD.COMPANY_HUB}/${item.id}`}
											title={item.title}
											description={item.description}
											className="w-full"
											imgClassName="object-contain"
										/>
									) : (
										<PollCard
											key={item.id}
											poll={item as Poll}
											className="h-full"
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
