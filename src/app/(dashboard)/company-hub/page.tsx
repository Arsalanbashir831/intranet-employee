"use client";

import { PageHeader } from "@/components/common/page-header";
import FeatureCard from "@/components/common/feature-card";
import { ROUTES } from "@/hooks/constants/routes";

import { useState, useMemo, useEffect } from "react";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { CardTableToolbar } from "@/components/common/card-table/card-table-toolbar";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/* ---------------- Types ---------------- */
interface CompanyHubItem {
	id: string;
	title: string;
	description: string;
}
interface Announcement extends CompanyHubItem {
	image: string;
	badgeLines: [string, string, string];
}
type Policy = CompanyHubItem;

/* ---------------- Mock Data ---------------- */
const ALL_ANNOUNCEMENTS: Announcement[] = [
	{
		id: "1",
		title: "New technology awareness.",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
		image: "/images/office-work.png",
		badgeLines: ["3", "No", "2021"],
	},
	{
		id: "2",
		title: "New technology awareness",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
		image: "/images/office-work.png",
		badgeLines: ["3", "No", "2021"],
	},
	{
		id: "3",
		title: "New technology awareness.",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
		image: "/images/office-work.png",
		badgeLines: ["3", "No", "2021"],
	},
	{
		id: "4",
		title: "New technology awareness",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
		image: "/images/office-work.png",
		badgeLines: ["3", "No", "2021"],
	},
	{
		id: "5",
		title: "New technology awareness.",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
		image: "/images/office-work.png",
		badgeLines: ["3", "No", "2021"],
	},
	{
		id: "6",
		title: "New technology awareness",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
		image: "/images/office-work.png",
		badgeLines: ["3", "No", "2021"],
	},
	{
		id: "7",
		title: "New technology awareness.",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
		image: "/images/office-work.png",
		badgeLines: ["3", "No", "2021"],
	},
];

const ALL_POLICIES: Policy[] = [
	{
		id: "p1",
		title: "Policy 1",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
	},
	{
		id: "p2",
		title: "Policy 1",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
	},
	{
		id: "p3",
		title: "Policy 1",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
	},
	{
		id: "p4",
		title: "Policy 1",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
	},
	{
		id: "p5",
		title: "Policy 1",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
	},
	{
		id: "p6",
		title: "Policy 1",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable.",
	},
];

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

	const dataSource: CompanyHubItem[] =
		activeTab === "announcements" ? ALL_ANNOUNCEMENTS : ALL_POLICIES;

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return q
			? dataSource.filter((a) => a.title.toLowerCase().includes(q))
			: dataSource;
	}, [query, dataSource]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

	const table = useReactTable<CompanyHubItem>({
		data: filtered,
		columns,
		getCoreRowModel: getCoreRowModel(),
		pageCount,
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

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<PageHeader
				title="Company Hub"
				crumbs={[
					{ label: "Pages" },
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
			<main
				className="
      mx-auto w-full
      px-4 sm:px-6 md:px-8
      py-6 sm:py-8 lg:py-10
    
    ">
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
							{pageItems.map((item) =>
								activeTab === "announcements" ? (
									<FeatureCard
										key={item.id}
										link={`/company-hub/${item.id}`} // 👈 Add this
										image={(item as Announcement).image}
										title={item.title}
										description={item.description}
										badgeLines={(item as Announcement).badgeLines}
										className="w-full "
										imgClassName="object-cover"
									/>
								) : (
									<FeatureCard
										key={item.id}
										link={`/company-hub/${item.id}`} // 👈 Add this
										title={item.title}
										description={item.description}
										className="w-full "
										imgClassName="object-cover"
									/>
								)
							)}
							{/* keep full rows on last page (optional) */}
							{Array.from({
								length: Math.max(0, pageSize - pageItems.length),
							}).map((_, i) => (
								<div key={`spacer-${i}`} className="hidden xl:block" />
							))}
						</div>

						{/* Pagination aligned right with the same vertical spacing as above */}
						<div className="flex items-center justify-end">
							<CardTablePagination table={table} />
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
