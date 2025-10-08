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

	// Mock polls data with different types - in a real app, this would come from an API
	const mockPolls: Poll[] = [
		{
			id: "1",
			title: "Office Environment Survey",
			description: "Help us improve our workplace environment by sharing your thoughts on the current office setup.",
			question: "How satisfied are you with the current office environment?",
			options: [
				{ id: "1-1", text: "Very Satisfied", votes: 45, percentage: 35 },
				{ id: "1-2", text: "Satisfied", votes: 38, percentage: 30 },
				{ id: "1-3", text: "Neutral", votes: 25, percentage: 20 },
				{ id: "1-4", text: "Dissatisfied", votes: 15, percentage: 12 },
				{ id: "1-5", text: "Very Dissatisfied", votes: 5, percentage: 3 }
			],
			totalVotes: 128,
			isActive: true,
			expiresAt: "2025-10-15T23:59:59Z",
			createdAt: "2025-01-15T10:00:00Z",
			userVoted: false,
			badgeLines: [
				new Date("2025-01-15T10:00:00Z").getDate().toString(),
				new Date("2025-01-15T10:00:00Z").toLocaleString("default", { month: "short" }),
				new Date("2025-01-15T10:00:00Z").getFullYear().toString()
			] as [string, string, string]
		},
		{
			id: "2",
			title: "Team Building Activities",
			description: "What type of team building activities would you prefer for our next company event?",
			question: "Which team building activity interests you most?",
			options: [
				{ id: "2-1", text: "Outdoor Adventure", votes: 32, percentage: 40 },
				{ id: "2-2", text: "Cooking Class", votes: 24, percentage: 30 },
				{ id: "2-3", text: "Escape Room", votes: 16, percentage: 20 },
				{ id: "2-4", text: "Sports Tournament", votes: 8, percentage: 10 }
			],
			totalVotes: 80,
			isActive: true,
			expiresAt: "2025-10-20T23:59:59Z",
			createdAt: "2025-01-16T14:30:00Z",
			userVoted: true,
			userVoteOptionId: "2-1",
			badgeLines: [
				new Date("2025-01-16T14:30:00Z").getDate().toString(),
				new Date("2025-01-16T14:30:00Z").toLocaleString("default", { month: "short" }),
				new Date("2025-01-16T14:30:00Z").getFullYear().toString()
			] as [string, string, string]
		},
		{
			id: "3",
			title: "Remote Work Policy",
			description: "Share your preferences regarding our remote work policy and hybrid arrangements.",
			question: "What's your preferred work arrangement?",
			options: [
				{ id: "3-1", text: "Fully Remote", votes: 28, percentage: 35 },
				{ id: "3-2", text: "Hybrid (2-3 days office)", votes: 32, percentage: 40 },
				{ id: "3-3", text: "Mostly Office", votes: 20, percentage: 25 }
			],
			totalVotes: 80,
			isActive: false,
			expiresAt: "2025-01-30T23:59:59Z",
			createdAt: "2025-01-10T09:00:00Z",
			userVoted: false,
			badgeLines: [
				new Date("2025-01-10T09:00:00Z").getDate().toString(),
				new Date("2025-01-10T09:00:00Z").toLocaleString("default", { month: "short" }),
				new Date("2025-01-10T09:00:00Z").getFullYear().toString()
			] as [string, string, string]
		},
		{
			id: "4",
			title: "Company Benefits Review",
			description: "Help us understand which benefits matter most to you for our annual benefits review.",
			question: "Which benefit would you like to see improved or added?",
			options: [
				{ id: "4-1", text: "Health Insurance", votes: 42, percentage: 28 },
				{ id: "4-2", text: "Retirement Plan", votes: 38, percentage: 25 },
				{ id: "4-3", text: "Paid Time Off", votes: 35, percentage: 23 },
				{ id: "4-4", text: "Professional Development", votes: 20, percentage: 13 },
				{ id: "4-5", text: "Flexible Hours", votes: 15, percentage: 10 }
			],
			totalVotes: 150,
			isActive: true,
			expiresAt: "2025-10-25T23:59:59Z",
			createdAt: "2025-01-18T09:15:00Z",
			userVoted: false,
			badgeLines: [
				new Date("2025-01-18T09:15:00Z").getDate().toString(),
				new Date("2025-01-18T09:15:00Z").toLocaleString("default", { month: "short" }),
				new Date("2025-01-18T09:15:00Z").getFullYear().toString()
			] as [string, string, string]
		},
		{
			id: "5",
			title: "Lunch Options Survey",
			description: "We're considering adding new lunch options to the office cafeteria. What would you prefer?",
			question: "What type of lunch service would you prefer?",
			options: [
				{ id: "5-1", text: "Catered Lunch Daily", votes: 25, percentage: 31 },
				{ id: "5-2", text: "Food Truck Fridays", votes: 22, percentage: 28 },
				{ id: "5-3", text: "Lunch Allowance", votes: 18, percentage: 23 },
				{ id: "5-4", text: "Current Setup", votes: 15, percentage: 19 }
			],
			totalVotes: 80,
			isActive: true,
			expiresAt: "2025-10-10T23:59:59Z",
			createdAt: "2025-01-20T11:30:00Z",
			userVoted: true,
			userVoteOptionId: "5-2",
			badgeLines: [
				new Date("2025-01-20T11:30:00Z").getDate().toString(),
				new Date("2025-01-20T11:30:00Z").toLocaleString("default", { month: "short" }),
				new Date("2025-01-20T11:30:00Z").getFullYear().toString()
			] as [string, string, string]
		},
		{
			id: "6",
			title: "Training Programs",
			description: "We're planning our training programs for the next quarter. What skills would you like to develop?",
			question: "Which training program interests you most?",
			options: [
				{ id: "6-1", text: "Leadership Skills", votes: 30, percentage: 30 },
				{ id: "6-2", text: "Technical Skills", votes: 28, percentage: 28 },
				{ id: "6-3", text: "Communication", votes: 25, percentage: 25 },
				{ id: "6-4", text: "Project Management", votes: 17, percentage: 17 }
			],
			totalVotes: 100,
			isActive: true,
			expiresAt: "2025-12-28T23:59:59Z",
			createdAt: "2025-10-22T14:45:00Z",
			userVoted: false,
			badgeLines: [
				new Date("2025-01-22T14:45:00Z").getDate().toString(),
				new Date("2025-01-22T14:45:00Z").toLocaleString("default", { month: "short" }),
				new Date("2025-01-22T14:45:00Z").getFullYear().toString()
			] as [string, string, string]
		}
	];

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
						: "/images/office-work.png",
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
		// Filter polls based on search query and show all polls (active and expired)
		const filteredPolls = mockPolls.filter(poll => {
			const matchesSearch = !debouncedQuery.trim() || 
				poll.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
				poll.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
				poll.question.toLowerCase().includes(debouncedQuery.toLowerCase());
			
			return matchesSearch;
		});
		dataSource = filteredPolls;
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
	const pollsCount = mockPolls.length;

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
