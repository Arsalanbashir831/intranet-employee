import { useQuery } from "@tanstack/react-query";
import { getFolderTree } from "@/services/knowledge-folders";
import { useAuth } from "@/contexts/auth-context";
import { FolderTreeItem, FolderTreeFile } from "@/services/knowledge-folders";

// Query key factory
export const knowledgeFoldersKeys = {
	all: ["knowledgeFolders"] as const,
	list: (params: Record<string, unknown> = {}) =>
		[...knowledgeFoldersKeys.all, "list", params] as const,
};

// Helper function to flatten the folder tree and filter by search term
function flattenAndFilterTree(
	items: FolderTreeItem[],
	searchTerm: string = ""
): FolderTreeItem[] {
	if (!searchTerm) return items;

	const lowerSearchTerm = searchTerm.toLowerCase();

	function searchInItem(item: FolderTreeItem): boolean {
		// Check if folder name matches
		if (item.name.toLowerCase().includes(lowerSearchTerm)) {
			return true;
		}

		// Check if any file in this folder matches
		if (
			item.files.some(
				(file) =>
					file.name.toLowerCase().includes(lowerSearchTerm) ||
					file.description.toLowerCase().includes(lowerSearchTerm)
			)
		) {
			return true;
		}

		// Check nested folders recursively
		return item.folders.some(searchInItem);
	}

	function filterFiles(files: FolderTreeFile[]): FolderTreeFile[] {
		if (!searchTerm) return files;
		return files.filter(
			(file) =>
				file.name.toLowerCase().includes(lowerSearchTerm) ||
				file.description.toLowerCase().includes(lowerSearchTerm)
		);
	}

	function filterFolders(folders: FolderTreeItem[]): FolderTreeItem[] {
		if (!searchTerm) return folders;
		return folders.filter(searchInItem).map((folder) => ({
			...folder,
			files: filterFiles(folder.files),
			folders: filterFolders(folder.folders),
		}));
	}

	return filterFolders(items);
}

// Hook to get paginated knowledge folders from tree
export function useKnowledgeFolders(
	page: number = 1,
	pageSize: number = 10,
	searchTerm: string = ""
) {
	const { user } = useAuth();

	return useQuery({
		queryKey: knowledgeFoldersKeys.list({
			page,
			pageSize,
			employeeId: user?.employeeId,
			searchTerm,
		}),
		queryFn: async () => {
			try {
				const employeeId = user?.employeeId
					? String(user.employeeId)
					: undefined;
				const treeData = await getFolderTree(employeeId);

				// Flatten and filter the tree based on search term
				const allFolders = flattenAndFilterTree(
					treeData?.folders || [],
					searchTerm
				);

				// Simulate pagination
				const startIndex = (page - 1) * pageSize;
				const endIndex = startIndex + pageSize;
				const paginatedFolders = allFolders.slice(startIndex, endIndex);

				return {
					folders: {
						count: allFolders.length,
						results: paginatedFolders,
						next: endIndex < allFolders.length ? `page=${page + 1}` : null,
						previous: page > 1 ? `page=${page - 1}` : null,
					},
				};
			} catch (error) {
				console.error("Error fetching knowledge folders:", error);
				throw error;
			}
		},
		placeholderData: (previousData) => previousData, // Keep previous data while fetching new data for smooth transitions
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
