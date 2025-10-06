import { useQuery } from "@tanstack/react-query";
import {
  getAllFolders,
  getFolders,
  getFolder,
  getFolderTree,
  searchFolders,
  FolderListParams,
} from "@/services/knowledge-folders";

// Query keys
export const folderKeys = {
  all: ["knowledge-folders"] as const,
  lists: () => [...folderKeys.all, "list"] as const,
  list: (params?: FolderListParams) => [...folderKeys.lists(), params] as const,
  details: () => [...folderKeys.all, "detail"] as const,
  detail: (id: number | string) => [...folderKeys.details(), id] as const,
  tree: (employeeId?: number | string) => [...folderKeys.all, "tree", employeeId] as const,
};

// Query hooks
export const useGetFolders = (params?: FolderListParams) => {
  return useQuery({
    queryKey: folderKeys.list(params),
    queryFn: () => getFolders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetAllFolders = () => {
  return useQuery({
    queryKey: folderKeys.lists(),
    queryFn: getAllFolders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
};

export const useSearchFolders = (params?: Record<string, string | number | boolean>) => {
  return useQuery({
    queryKey: [...folderKeys.lists(), params],
    queryFn: () => searchFolders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
};

export const useGetFolder = (id: number | string, enabled: boolean = true) => {
  return useQuery({
    queryKey: folderKeys.detail(id),
    queryFn: () => getFolder(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetFolderTree = (employeeId?: number | string) => {
  return useQuery({
    queryKey: folderKeys.tree(employeeId),
    queryFn: () => getFolderTree(employeeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};