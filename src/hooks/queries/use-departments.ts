import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
	BranchDepartment,
	Department,
	DepartmentListResponse,
	getBranchDepartmentEmployees,
  listDepartments,
} from "@/services/departments";
import { API_ROUTES } from "@/constants/api-routes";
import apiCaller from "@/lib/api-caller";

// Hook to fetch all departments
export function useDepartments(
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  const keyParams = normalizeParams(params);
  const keyPagination =
    pagination && (pagination.page || pagination.pageSize)
      ? { page: pagination.page ?? 1, pageSize: pagination.pageSize ?? 50 }
      : undefined;

  return useQuery({
    queryKey: ["departments", keyParams, keyPagination],
    queryFn: () => listDepartments(keyParams, keyPagination),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

// Hook to fetch all branch departments
export function useBranchDepartments(
	params?: Record<string, string | number | boolean>
) {
	// reuse the same list endpoint (page_size bump) while keeping params stable
	const {
		data: departmentsData,
		isLoading,
		error,
	} = useDepartments({ ...(params ?? {}), page_size: 1000 });

	// Maintain previous data during refetch (we already do via useDepartments)
	const branchDepartments = Array.isArray(departmentsData)
		? departmentsData
		: (departmentsData as DepartmentListResponse)?.departments?.results || [];

	const allBranchDepartments = branchDepartments.flatMap((dept: Department) => {
		const deptName =
			dept.dept_name ||
			(dept as Record<string, unknown>).name ||
			"Unknown Department";
		const bds = dept.branch_departments || [];
		return bds.map((bd: BranchDepartment) => ({
			id: bd.id,
			branch: bd.branch || {
				branch_name:
					(bd as Record<string, unknown>).branch_name || "Unknown Branch",
			},
			department: { dept_name: deptName },
		}));
	});

	return { data: allBranchDepartments, isLoading, error };
}

// Helpers
const normalizeParams = (
	params?: Record<string, string | number | boolean>
) => {
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
		queryKey: [
			"branch-department-employees",
			String(branchDepartmentId),
			keyPagination,
			keyParams,
		],
		queryFn: () =>
			getBranchDepartmentEmployees(
				branchDepartmentId,
				keyPagination,
				keyParams
			),
		enabled: !!branchDepartmentId,
		staleTime: 60_000,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
	});
}
