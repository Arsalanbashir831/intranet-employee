import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getBranchDepartmentEmployees,
} from "@/services/departments";


// Helpers
const normalizeParams = (params?: Record<string, string | number | boolean>) => {
  if (!params) return undefined;
  const entries = Object.entries(params).sort(([a], [b]) => (a > b ? 1 : -1));
  return Object.fromEntries(entries);
};

export function useBranchDepartmentEmployees(
  branchDepartmentId: number | string,
  pagination?: { page?: number; pageSize?: number },
  params?: Record<string, string | number | boolean>
) {
  const keyParams = normalizeParams(params);
  const keyPagination =
    pagination && (pagination.page || pagination.pageSize)
      ? { page: pagination.page ?? 1, pageSize: pagination.pageSize ?? 50 }
      : undefined;

  return useQuery({
    queryKey: ["branch-department-employees", String(branchDepartmentId), keyPagination, keyParams],
    queryFn: () => getBranchDepartmentEmployees(branchDepartmentId, keyPagination, keyParams),
    enabled: !!branchDepartmentId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}