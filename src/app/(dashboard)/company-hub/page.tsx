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
import { CardTableToolbar } from "@/components/card-table/card-table-toolbar";
import { CardTablePagination } from "@/components/card-table/card-table-pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
// ---- Types ----
interface CompanyHubItem {
	id: string;
	title: string;
	description: string;
}

interface Announcement extends CompanyHubItem {
	image: string;
	badgeLines: [string, string, string];
}

interface Policy extends CompanyHubItem {}

// ---- Mock data ----
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

// Example policies dataset
const ALL_POLICIES: Policy[] = [
	{
		id: "p1",
		title: "Policy 1 ",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable. ",
	},
	{
		id: "p2",
		title: "Policy 1 ",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable. ",
	},
	{
		id: "p3",
		title: "Policy 1 ",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable. ",
	},
	{
		id: "p4",
		title: "Policy 1 ",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable. ",
	},
	{
		id: "p5",
		title: "Policy 1 ",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable. ",
	},
	{
		id: "p6",
		title: "Policy 1 ",
		description:
			"Delightful remarkably mr on announcing themselves entreaties favourable. ",
	},
];

// ---- Table setup (shared for both) ----
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

export default function CompanyHub() {
	const search = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	// ✅ initialize from URL or default
	const urlTab =
		(search.get("tab") as "announcements" | "policies") ?? "announcements";
	const [activeTab, setActiveTab] = useState<"announcements" | "policies">(
		urlTab
	);

	// ✅ sync if URL changes (back/forward)
	useEffect(() => {
		const next =
			(search.get("tab") as "announcements" | "policies") ?? "announcements";
		if (next !== activeTab) setActiveTab(next);
	}, [search]);

	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
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

	const handleSortChange = (value: string) => {
		setPage(1);
	};

	const handleTabChange = (tabKey: string) => {
		const t = tabKey as "announcements" | "policies";
		setActiveTab(t);
		setPage(1);
		setQuery("");

		// ✅ update query param
		const qs = new URLSearchParams(search.toString());
		qs.set("tab", t);
		router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
	};

	return (
		<div>
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
				activeTab={activeTab} // controlled
				onTabChange={handleTabChange} // update state + URL
			/>

			<div className="mx-auto md:max-w-[420px] lg:max-w-[786px] xl:max-w-[1400px] p-4 md:p-6">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<CardTableToolbar
						title={activeTab === "announcements" ? "Announcements" : "Policies"}
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

					<section className="mt-6">
						<div className="grid gap-5 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
							{pageItems.map((item) =>
								activeTab === "announcements" ? (
									<FeatureCard
										key={item.id}
										image={(item as Announcement).image}
										title={item.title}
										description={item.description}
										badgeLines={(item as Announcement).badgeLines}
										link={`/company-hub/${item.id}`}
										width={320}
										height={500}
									/>
								) : (
									<FeatureCard
										key={item.id}
										title={item.title}
										description={item.description}
										link={`/company-hub/${item.id}`}
										width={320}
										height={450}
									/>
								)
							)}
							{Array.from({
								length: Math.max(0, pageSize - pageItems.length),
							}).map((_, i) => (
								<div key={`spacer-${i}`} className="hidden lg:block" />
							))}
						</div>
					</section>

					<div className="flex items-center justify-end mt-6">
						<CardTablePagination table={table} />
					</div>
				</div>
			</div>
		</div>
	);
}
