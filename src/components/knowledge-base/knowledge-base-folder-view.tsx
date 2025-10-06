"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getFolderTree, FolderTreeItem } from "@/services/knowledge-folders";
import { ROUTES } from "@/constants/routes";
import KnowledgeBaseTable, { KnowledgeBaseRow } from "./knowledge-base-table";
import { PageHeader } from "../common/page-header";

// Utility functions for filtering and converting folder/file to row
function filterFolderContents(
	folder: FolderTreeItem,
	searchTerm: string
): FolderTreeItem {
	if (!searchTerm) return folder;
	const lower = searchTerm.toLowerCase();
	return {
		...folder,
		folders: folder.folders.filter((f) => f.name.toLowerCase().includes(lower)),
		files: folder.files.filter((f) => f.name.toLowerCase().includes(lower)),
	};
}
function convertFolderToRow(folder: FolderTreeItem): KnowledgeBaseRow {
	return {
		id: String(folder.id),
		folder: folder.name,
		createdByName: "",
		dateCreated: folder.created_at,
		type: "folder",
	};
}
function convertFileToRow(file: any): KnowledgeBaseRow {
	return {
		id: String(file.id),
		folder: file.name,
		createdByName: "",
		dateCreated: file.uploaded_at || "",
		type: "file",
		fileUrl: file.file_url,
	};
}

export function KnowledgeBaseFolderView({
	folderPath,
}: {
	folderPath: string[];
}) {
	const { user } = useAuth();
	const router = useRouter();
	const [folderTree, setFolderTree] = useState<FolderTreeItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const employeeId = user?.employeeId
					? String(user.employeeId)
					: undefined;
				const tree = await getFolderTree(employeeId);
				// If API returns { folders: FolderTreeItem[] }, use the first folder or wrap as needed
				if (Array.isArray(tree.folders)) {
					setFolderTree({
						id: 0,
						name: "Root",
						description: "",
						parent: null,
						created_at: new Date().toISOString(),
						inherits_parent_permissions: true,
						effective_permissions: {
							branches: [],
							departments: [],
							employees: [],
						},
						files: [],
						folders: tree.folders,
					});
				} else {
					setFolderTree(tree as FolderTreeItem);
				}
			} catch (err) {
				setError("Failed to load folder contents");
				setFolderTree(null);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user?.employeeId]);

	const targetFolder = useMemo(() => {
		if (!folderTree) return null;
		const currentFolders = folderTree.folders || [];
		if (folderPath.length === 0) {
			return {
				id: 0,
				name: "Root",
				description: "",
				parent: null,
				created_at: new Date().toISOString(),
				inherits_parent_permissions: true,
				effective_permissions: {
					branches: [],
					departments: [],
					employees: [],
				},
				files: [],
				folders: currentFolders,
			};
		}
		const findFolderByPath = (
			folders: FolderTreeItem[],
			path: string[],
			depth: number
		): FolderTreeItem | null => {
			if (depth >= path.length) return null;
			const folderName = path[depth];
			for (const folder of folders) {
				if (folder.name === folderName) {
					if (depth === path.length - 1) {
						return folder;
					} else {
						const result = findFolderByPath(folder.folders, path, depth + 1);
						if (result) return result;
					}
				}
			}
			return null;
		};
		return findFolderByPath(currentFolders, folderPath, 0);
	}, [folderTree, folderPath]);

	const filteredFolder = useMemo(() => {
		if (!targetFolder) return null;
		return filterFolderContents(targetFolder, searchTerm);
	}, [targetFolder, searchTerm]);

	const data = useMemo(() => {
		if (!filteredFolder) return [];
		const folderRows = filteredFolder.folders?.map(convertFolderToRow) || [];
		const fileRows = filteredFolder.files?.map(convertFileToRow) || [];
		return [...folderRows, ...fileRows];
	}, [filteredFolder]);

	const handleRowClick = (row: KnowledgeBaseRow) => {
		if (row.type === "folder") {
			const newPath = [...folderPath, row.folder];
			router.push(
				`${ROUTES.DASHBOARD.KNOWLEDGE_BASE}/${newPath
					.map(encodeURIComponent)
					.join("/")}`
			);
		} else if (row.type === "file" && row.fileUrl) {
			window.open(row.fileUrl, "_blank");
		}
	};

	const handleSearch = (term: string) => {
		setSearchTerm(term);
	};

	if (loading) {
		return (
			<div className="">
				<PageHeader
					title="Knowledge Base"
					crumbs={[
						{ label: "Pages", href: "#" },
						{ label: "Knowledge Base", href: ROUTES.DASHBOARD.KNOWLEDGE_BASE },
					]}
				/>
				<div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
					<div className="animate-pulse">
						<div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="h-12 bg-gray-100 rounded"></div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="">
				<PageHeader
					title="Knowledge Base"
					crumbs={[
						{ label: "Pages", href: "#" },
						{ label: "Knowledge Base", href: ROUTES.DASHBOARD.KNOWLEDGE_BASE },
					]}
				/>
				<div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
					<div className="text-red-500">Error: {error}</div>
				</div>
			</div>
		);
	}

	// Build breadcrumbs
	const crumbs = [
		{ label: "Pages", href: "#" },
		{ label: "Knowledge Base", href: ROUTES.DASHBOARD.KNOWLEDGE_BASE },
	];
	folderPath.forEach((folder, index) => {
		const pathToThisFolder = folderPath.slice(0, index + 1);
		const decodedFolderName = decodeURIComponent(folder);
		crumbs.push({
			label: decodedFolderName,
			href: `${ROUTES.DASHBOARD.KNOWLEDGE_BASE}/${pathToThisFolder
				.map(encodeURIComponent)
				.join("/")}`,
		});
	});

	return (
		<div>
			<PageHeader title="Knowledge Base" crumbs={crumbs} />
			<div className="">
				<KnowledgeBaseTable
					data={data}
					title={
						folderPath.length > 0
							? folderPath[folderPath.length - 1]
							: "Knowledge Base"
					}
					onRowClick={handleRowClick}
					onSearch={handleSearch}
					searchTerm={searchTerm}
					showToolbar={true}
				/>
			</div>
		</div>
	);
}
