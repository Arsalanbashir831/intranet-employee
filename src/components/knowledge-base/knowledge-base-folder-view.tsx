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
		createdByName: folder.created_by?.emp_name || "Admin",
		createdByAvatar: folder.created_by?.profile_picture || undefined,
		dateCreated: folder.created_at,
		type: "folder",
		createdBy: folder.created_by,
	};
}
import type { FolderTreeFile } from "@/services/knowledge-folders";
function convertFileToRow(file: FolderTreeFile): KnowledgeBaseRow {
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
					created_by: {
						id: null,
						emp_name: "System",
						email: null,
						phone: null,
						role: null,
						profile_picture: null,
						branch_department_ids: [],
						is_admin: false,
					},
					access_level: {
						branches: [],
						departments: [],
						branch_departments: [],
						employees: [],
					},
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
			} catch {
				setError("Failed to load folder contents");
				setFolderTree(null);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user?.employeeId]);

	// Create a flat lookup map of all folders by ID
	const folderMap = useMemo(() => {
		if (!folderTree) return new Map<number, FolderTreeItem>();
		const map = new Map<number, FolderTreeItem>();

		const addToMap = (folder: FolderTreeItem) => {
			map.set(folder.id, folder);
			folder.folders?.forEach(addToMap);
		};

		folderTree.folders?.forEach(addToMap);
		return map;
	}, [folderTree]);

	const targetFolder = useMemo(() => {
		if (!folderTree) return null;

		// If no path, show root with all top-level folders
		if (folderPath.length === 0) {
			return {
				id: 0,
				name: "Root",
				description: "",
				parent: null,
				created_at: new Date().toISOString(),
				inherits_parent_permissions: true,
				created_by: {
					id: null,
					emp_name: "System",
					email: null,
					phone: null,
					role: null,
					profile_picture: null,
					branch_department_ids: [],
					is_admin: false,
				},
				access_level: {
					branches: [],
					departments: [],
					branch_departments: [],
					employees: [],
				},
				effective_permissions: {
					branches: [],
					departments: [],
					employees: [],
				},
				files: [],
				folders: folderTree.folders || [],
			};
		}

		// Get folder ID from path (expect last segment to be the folder ID)
		const folderId = parseInt(folderPath[folderPath.length - 1]);
		if (isNaN(folderId)) return null;

		return folderMap.get(folderId) || null;
	}, [folderTree, folderPath, folderMap]);

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
			// Navigate using folder ID
			router.push(`${ROUTES.DASHBOARD.KNOWLEDGE_BASE}/${row.id}`);
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

	// Build breadcrumbs using folder hierarchy
	const crumbs = [
		{ label: "Pages", href: "#" },
		{ label: "Knowledge Base", href: ROUTES.DASHBOARD.KNOWLEDGE_BASE },
	];

	if (targetFolder && targetFolder.id !== 0) {
		// Build path from current folder back to root
		const pathFolders: FolderTreeItem[] = [];
		let current: FolderTreeItem | null = targetFolder;

		while (current && current.id !== 0) {
			pathFolders.unshift(current);
			if (current.parent) {
				current = folderMap.get(current.parent) || null;
			} else {
				break;
			}
		}

		// Add breadcrumbs for each folder in the path
		pathFolders.forEach((folder) => {
			crumbs.push({
				label: folder.name,
				href: `${ROUTES.DASHBOARD.KNOWLEDGE_BASE}/${folder.id}`,
			});
		});
	}

	return (
		<div>
			<PageHeader title="Knowledge Base" crumbs={crumbs} />
			<div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
				<KnowledgeBaseTable
					data={data}
					title={targetFolder?.name || "Knowledge Base"}
					onRowClick={handleRowClick}
					onSearch={handleSearch}
					searchTerm={searchTerm}
					showToolbar={true}
				/>
			</div>
		</div>
	);
}
