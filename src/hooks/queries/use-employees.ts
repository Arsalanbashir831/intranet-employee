import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getEmployee, uploadProfilePicture, deleteProfilePicture, updateEmployee } from "@/services/employees";
import { useAuth } from "@/contexts/auth-context";

// Query key factory
export const employeeKeys = {
	all: ["employees"] as const,
	detail: (id: number | string) => [...employeeKeys.all, "detail", id] as const,
};

// Hook to get employee details
export function useEmployee(employeeId?: number | string) {
	const { user } = useAuth();
	const id = employeeId || user?.employeeId || 0;
	
	return useQuery({
		queryKey: employeeKeys.detail(id),
		queryFn: () => getEmployee(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Hook to upload profile picture
export function useUploadProfilePicture() {
	const queryClient = useQueryClient();
	const { user, refreshAuth } = useAuth();
	
	return useMutation({
		mutationFn: (file: File) => uploadProfilePicture(user?.employeeId || 0, file),
		onSuccess: () => {
			// Invalidate and refetch employee data
			queryClient.invalidateQueries({ queryKey: employeeKeys.detail(user?.employeeId || 0) });
			// Refresh auth context to update user profile picture
			refreshAuth();
			// Dispatch custom event to notify other components
			if (typeof window !== "undefined") {
				window.dispatchEvent(new CustomEvent('auth:refresh'));
			}
		},
	});
}

// Hook to delete profile picture
export function useDeleteProfilePicture() {
	const queryClient = useQueryClient();
	const { user, refreshAuth } = useAuth();
	
	return useMutation({
		mutationFn: () => deleteProfilePicture(user?.employeeId || 0),
		onSuccess: () => {
			// Invalidate and refetch employee data
			queryClient.invalidateQueries({ queryKey: employeeKeys.detail(user?.employeeId || 0) });
			// Refresh auth context to update user profile picture
			refreshAuth();
			// Dispatch custom event to notify other components
			if (typeof window !== "undefined") {
				window.dispatchEvent(new CustomEvent('auth:refresh'));
			}
		},
	});
}

// Hook to update employee data
export function useUpdateEmployee() {
	const queryClient = useQueryClient();
	const { user, refreshAuth } = useAuth();
	
	return useMutation({
		mutationFn: (data: Parameters<typeof updateEmployee>[1]) => 
			updateEmployee(user?.employeeId || 0, data),
		onSuccess: () => {
			// Invalidate and refetch employee data
			queryClient.invalidateQueries({ queryKey: employeeKeys.detail(user?.employeeId || 0) });
			// Refresh auth context to update user data
			refreshAuth();
			// Dispatch custom event to notify other components
			if (typeof window !== "undefined") {
				window.dispatchEvent(new CustomEvent('auth:refresh'));
			}
		},
	});
}