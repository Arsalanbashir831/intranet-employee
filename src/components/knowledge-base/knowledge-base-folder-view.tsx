"use client";

import { useState, useEffect } from "react";
import { KnowledgeBaseTable } from "@/components/knowledge-base/knowledge-base-table";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import { KnowledgeBaseRow } from "@/components/knowledge-base/knowledge-base-table";
import { getFolderTree } from "@/services/knowledge-folders";
import { useAuth } from "@/contexts/auth-context";
import { FolderTreeItem, FolderTreeFile } from "@/services/knowledge-folders";
import { useRouter } from "next/navigation";

// Convert API folder data to table row format
const convertFolderToRow = (folder: FolderTreeItem): KnowledgeBaseRow => ({
	id: folder.id.toString(),
	folder: folder.name,
	createdByName: "Cartwright King",
	createdByAvatar: "/images/logo-circle.png",
	dateCreated: new Date(folder.created_at).toISOString().split('T')[0],
	type: "folder",
});

// Convert API file data to table row format
const convertFileToRow = (file: FolderTreeFile): KnowledgeBaseRow => ({
	id: file.id.toString(),
	folder: file.name,
	createdByName: "Cartwright King",
	createdByAvatar: "/images/logo-circle.png",
	dateCreated: new Date(file.uploaded_at).toISOString().split('T')[0],
	type: "file",
	fileUrl: file.file, // Add file URL for downloading
});

export function KnowledgeBaseFolderView({
	folderPath,
}: {
	folderPath: string[];
}) {
	const { user } = useAuth();
	const router = useRouter();
	const [data, setData] = useState<KnowledgeBaseRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				// Get folder tree
				const employeeId = user?.employeeId ? String(user.employeeId) : undefined;
				const folderTree = await getFolderTree(employeeId);

				// Navigate through the folder path to find the current folder
				const currentFolders = folderTree?.folders || [];
				let targetFolder = null;
				let folderName = "Knowledge Base";

				// If we have a folder path, navigate through it
				if (folderPath.length > 0) {
					let foundFolder = null;

					// Recursive function to find folder by path
					const findFolderByPath = (folders: FolderTreeItem[], path: string[], depth: number): FolderTreeItem | null => {
						if (depth >= path.length) return null;

						const folderName = path[depth];
						for (const folder of folders) {
							if (folder.name === folderName) {
								if (depth === path.length - 1) {
									// Found the target folder
									return folder;
								} else {
									// Continue searching in subfolders
									const result = findFolderByPath(folder.folders, path, depth + 1);
									if (result) return result;
								}
							}
						}
						return null;
					};

					foundFolder = findFolderByPath(currentFolders, folderPath, 0);
					targetFolder = foundFolder;
					folderName = folderPath.join(" / ");
				} else {
					// Root level - show all top-level folders
					targetFolder = {
						id: 0,
						name: "Root",
						description: "",
						parent: null,
						created_at: new Date().toISOString(),
						inherits_parent_permissions: true,
						effective_permissions: {
							branches: [],
							departments: [],
							employees: []
						},
						files: [],
						folders: currentFolders
					};
				}

				if (targetFolder) {
					// Combine files and subfolders into rows
					const folderRows = targetFolder.folders?.map(convertFolderToRow) || [];
					const fileRows = targetFolder.files?.map(convertFileToRow) || [];

					setData([...folderRows, ...fileRows]);
				} else {
					// If folder not found, show empty data
					setData([]);
				}
			} catch (err) {
				console.error("Error fetching folder contents:", err);
				setError("Failed to load folder contents");
				setData([]);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [folderPath, user?.employeeId]);

	const handleRowClick = (row: KnowledgeBaseRow) => {
		if (row.type === "folder") {
			// Navigate to the folder
			const newPath = [...folderPath, row.folder];
			router.push(`${ROUTES.DASHBOARD.KNOWLEDGE_BASE}/${newPath.map(encodeURIComponent).join("/")}`);
		} else if (row.type === "file" && row.fileUrl) {
			// Download the file
			window.open(row.fileUrl, "_blank");
		}
	};

	if (loading) {
		return (
			<div className="">
				<PageHeader
					title="Knowledge Base"
					crumbs={[
						{ label: "Pages", href: '#' },
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
						{ label: "Pages", href: '#' },
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
		{ label: "Pages", href: '#' },
		{ label: "Knowledge Base", href: ROUTES.DASHBOARD.KNOWLEDGE_BASE },
	];

	folderPath.forEach((folder, index) => {
		const pathToThisFolder = folderPath.slice(0, index + 1);
		// Decode URI components to handle spaces and special characters
		const decodedFolderName = decodeURIComponent(folder);
		crumbs.push({
			label: decodedFolderName,
			href: `${ROUTES.DASHBOARD.KNOWLEDGE_BASE}/${pathToThisFolder.map(encodeURIComponent).join("/")}`
		});
	});

	return (
		<div>
			<PageHeader
				title="Knowledge Base"
				crumbs={crumbs}
			/>
			<div className="p-4 sm:p-8 lg:p-6">
				<KnowledgeBaseTable
					data={data}
					title={folderPath.length > 0 ? folderPath[folderPath.length - 1] : "Knowledge Base"}
					onRowClick={handleRowClick}
				/>
			</div>
		</div>
	);
}
