// components/knowledge-base/knowledge-base-table.tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { CardTable } from "@/components/common/card-table/card-table";
import { CardTableColumnHeader } from "@/components/common/card-table/card-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CardTableToolbar } from "@/components/common/card-table/card-table-toolbar";
import { CardTablePagination } from "@/components/common/card-table/card-table-pagination";
import { FolderIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ---------------- Types ---------------- */
export type KnowledgeBaseRow = {
	id: string;
	folder: string;
	createdByName: string;
	createdByAvatar?: string;
	dateCreated: string; // YYYY-MM-DD
};

type Props = {
	data?: KnowledgeBaseRow[];
	title?: string;
	viewMoreHref?: string;
	limit?: number;
	showToolbar?: boolean;
	baseHref?: string;
	className?: string;
};

/* --------------- Demo rows --------------- */
const defaultRows: KnowledgeBaseRow[] = [
	{
		id: "1",
		folder: "Folder 1",
		createdByName: "Cartwright King",
		dateCreated: "2024-07-26",
	},
	{
		id: "2",
		folder: "Folder 1",
		createdByName: "Cartwright King",
		dateCreated: "2024-07-26",
	},
	{
		id: "3",
		folder: "Folder 1",
		createdByName: "Cartwright King",
		dateCreated: "2024-07-26",
	},
	{
		id: "4",
		folder: "Folder 1",
		createdByName: "Cartwright King",
		dateCreated: "2024-07-26",
	},
];

/* --------------- Component --------------- */
export function KnowledgeBaseTable({
	data,
	title = "Knowledge Base",
	viewMoreHref,
	limit,
	showToolbar = true,
	baseHref = "/knowledge-base",
	className,
}: Props) {
	const pathname = usePathname();

	// Read first segment after baseHref and format it as "Folder 1"
	const currentFolder = React.useMemo(() => {
		if (!pathname) return undefined;

		const base = baseHref.replace(/\/+$/, "");
		const path = pathname.replace(/\/+$/, "");
		if (!path.startsWith(base)) return undefined;

		const rest = path.slice(base.length).replace(/^\/+/, "");
		const seg = rest.split("/")[0] || "";
		if (!seg) return undefined;

		// Try URL decode; then normalize common separators to spaces
		try {
			const decoded = decodeURIComponent(seg);
			return decoded.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
		} catch {
			return seg
				.replace(/%20|#20/gi, " ")
				.replace(/[-_]+/g, " ")
				.replace(/\s+/g, " ")
				.trim();
		}
	}, [pathname, baseHref]);

	// If we're inside a folder, show exactly that name, otherwise the default title
	const displayTitle = currentFolder ?? title;

	const isControlled = data !== undefined;
	const [sortedBy, setSortedBy] = React.useState<string>("folder");
	const [internalData, setInternalData] = React.useState<KnowledgeBaseRow[]>(
		isControlled ? data! : defaultRows
	);

	React.useEffect(() => {
		if (isControlled) {
			setInternalData(data!);
			return;
		}
		const copy = [...defaultRows];
		copy.sort((a, b) => {
			const key = sortedBy as keyof KnowledgeBaseRow;
			const av = (a[key] ?? "") as string;
			const bv = (b[key] ?? "") as string;
			return String(av).localeCompare(String(bv));
		});
		setInternalData(copy);
	}, [sortedBy, data, isControlled]);

	const tableData = limit ? internalData.slice(0, limit) : internalData;

	const columns: ColumnDef<KnowledgeBaseRow>[] = [
		{
			accessorKey: "folder",
			header: ({ column }) => (
				<CardTableColumnHeader column={column} title="Folder" />
			),
			cell: ({ row }) => (
				<div className="flex items-center gap-2 min-w-0">
					<FolderIcon className="size-4 sm:size-5 text-[#667085] shrink-0" />
					<Link
						href={`${baseHref}/${encodeURIComponent(row.original.folder)}`}
						className="text-sm sm:text-[15px] text-[#1F2937] leading-none hover:underline hover:text-[#E5004E] truncate"
						title={row.original.folder}>
						{row.original.folder}
					</Link>
				</div>
			),
		},
		{
			accessorKey: "createdByName",
			header: ({ column }) => (
				<div className="hidden sm:block">
					<CardTableColumnHeader column={column} title="Created By" />
				</div>
			),
			cell: ({ row }) => {
				const name = row.original.createdByName;
				return (
					<div className="hidden sm:flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarImage
								src={row.original.createdByAvatar || "/images/logo-circle.png"}
								alt={name}
							/>
							<AvatarFallback className="text-[10px] leading-none">
								{name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<span className="text-sm text-[#1F2937] leading-none">{name}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "dateCreated",
			header: ({ column }) => (
				<div className="hidden md:block">
					<CardTableColumnHeader column={column} title="Date Created" />
				</div>
			),
			cell: ({ getValue }) => (
				<span className="hidden md:inline text-sm text-[#667085] leading-none">
					{String(getValue())}
				</span>
			),
		},
		{
			id: "actions",
			header: () => (
				<span className="hidden md:inline text-sm font-medium text-[#727272]">
					Action
				</span>
			),
			cell: ({ row }) => {
				const href = `${baseHref}/${encodeURIComponent(row.original.folder)}`;
				const isOnKnowledgeBasePage = pathname === baseHref; // exact match

				return (
					<Link
						href={href}
						className="hidden md:inline text-[#D64575] text-sm font-medium underline leading-none">
						{isOnKnowledgeBasePage ? "Download" : "See Details"}
					</Link>
				);
			},
		},
	];

	return (
		<Card
			className={cn(
				"shadow-none border-[#FFF6F6] p-4 sm:p-5 md:p-5",
				"w-full h-full",
				className
			)}>
			{showToolbar ? (
				<CardTableToolbar
					title={displayTitle}
					onSearchChange={() => {}}
					sortOptions={[
						{ label: "Folder", value: "folder" },
						{ label: "Created By", value: "createdByName" },
						{ label: "Date Created", value: "dateCreated" },
					]}
					activeSort={sortedBy}
					onSortChange={(v) => setSortedBy(v)}
					onFilterClick={() => {}}
					className="flex sm:flex-col sm:items-start"
				/>
			) : (
				<div className="mb-3 sm:mb-4 flex items-center justify-between">
					<h3 className="text-base sm:text-lg font-semibold">{displayTitle}</h3>
					{viewMoreHref && (
						<Link
							href={viewMoreHref}
							className="text-xs sm:text-sm font-medium text-[#E5004E] underline">
							View More
						</Link>
					)}
				</div>
			)}

			<div className="overflow-y-auto pr-2 pb-2">
				<CardTable<KnowledgeBaseRow, unknown>
					columns={columns}
					data={tableData}
					headerClassName="
            grid-cols-[1fr]
            sm:grid-cols-[1.1fr_0.9fr]
            md:grid-cols-[1.2fr_1fr_0.9fr_0.7fr]
          "
					rowClassName={() => `
            hover:bg-[#FAFAFB]
            grid-cols-[1fr]
            sm:grid-cols-[1.1fr_0.9fr]
            md:grid-cols-[1.2fr_1fr_0.9fr_0.7fr]
          `}
					footer={(table) =>
						limit ? null : <CardTablePagination table={table} />
					}
				/>
			</div>
		</Card>
	);
}

export default KnowledgeBaseTable;
