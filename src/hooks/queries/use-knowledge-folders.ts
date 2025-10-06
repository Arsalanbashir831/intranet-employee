import { useQuery } from "@tanstack/react-query";
import { getFolderTree } from "@/services/knowledge-folders";
import { useAuth } from "@/contexts/auth-context";

// Query key factory
export const knowledgeFoldersKeys = {
	all: ["knowledgeFolders"] as const,
	list: (params: Record<string, any> = {}) => [...knowledgeFoldersKeys.all, "list", params] as const,
};

// Hook to get paginated knowledge folders from tree
export function useKnowledgeFolders(page: number = 1, pageSize: number = 10) {
	const { user } = useAuth();
	
	return useQuery({
		queryKey: knowledgeFoldersKeys.list({ page, pageSize, employeeId: user?.employeeId }),
		queryFn: async () => {
			try {
				const employeeId = user?.employeeId ? String(user.employeeId) : undefined;
				const treeData = await getFolderTree(employeeId);
				
				// Extract top-level folders from the tree
				const allFolders = treeData?.folders || [];
				
				// Simulate pagination
				const startIndex = (page - 1) * pageSize;
				const endIndex = startIndex + pageSize;
				const paginatedFolders = allFolders.slice(startIndex, endIndex);
				
				return {
					folders: {
						count: allFolders.length,
						results: paginatedFolders,
						next: endIndex < allFolders.length ? `page=${page + 1}` : null,
						previous: page > 1 ? `page=${page - 1}` : null
					}
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