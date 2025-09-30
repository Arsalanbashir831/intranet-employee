"use client";

import { useState, useEffect } from "react";
import { KnowledgeBaseTable } from "@/components/knowledge-base/knowledge-base-table";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/hooks/constants/routes";
import { KnowledgeBaseRow } from "@/components/knowledge-base/knowledge-base-table";
import { FolderIcon } from "lucide-react";

// Simulated data fetcher (replace with real API later)
const fetchFolderContents = async (
	folderName: string
): Promise<KnowledgeBaseRow[]> => {
	// In real app: return await api.get(`/folders/${folderName}/files`);
	return [
		{
			id: "1",
			folder: "File 1",
			createdByName: "Cartwright King",
			createdByAvatar: "",
			dateCreated: "2024-07-26",
		},
		{
			id: "2",
			folder: "Folder 1",
			createdByName: "Cartwright King",
			createdByAvatar: "",
			dateCreated: "2024-07-26",
		},
		{
			id: "3",
			folder: "Folder 1",
			createdByName: "Cartwright King",
			createdByAvatar: "",
			dateCreated: "2024-07-26",
		},
	];
};

export function KnowledgeBaseFolderView({
	folderName,
}: {
	folderName: string;
}) {
	const [data, setData] = useState<KnowledgeBaseRow[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		fetchFolderContents(folderName)
			.then(setData)
			.finally(() => setLoading(false));
	}, [folderName]);

	if (loading) {
		return (
			<div className="p-8">
				<PageHeader
					title="Knowledge Base"
					crumbs={[
						{ label: "Pages" },
						{ label: "Knowledge Base", href: ROUTES.DASHBOARD.KNOWLEDGE_BASE },
					]}
				/>
				<div className="p-4 sm:p-8 lg:p-6">
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

	return (
		<div>
			<PageHeader
				title="Knowledge Base"
				crumbs={[
					{ label: "Pages" },
					{ label: "Knowledge Base", href: ROUTES.DASHBOARD.KNOWLEDGE_BASE },
				]}
			/>
			<div className="p-4 sm:p-8 lg:p-6">
				<KnowledgeBaseTable data={data} />
			</div>
		</div>
	);
}
