import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getEmployee,
} from "@/services/employees";

/** Consistent detail key (stringify id). */
const employeeDetailKey = (id: number | string) => ["employees", String(id)] as const;

/* =========================
   Queries
   ========================= */

export function useEmployee(id: number | string) {
  return useQuery({
    queryKey: employeeDetailKey(id),
    queryFn: () => getEmployee(id),
    enabled: !!id,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData, // keeps old detail while refreshing
  });
}