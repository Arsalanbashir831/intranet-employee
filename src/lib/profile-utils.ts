/**
 * Profile-related utility functions
 */

import type { Employee as ApiEmployee } from "@/types/auth";

export interface EmployeeProfileData {
	id: string;
	name: string;
	role: string;
	email: string;
	phone: string;
	joinDate: string;
	department: string;
	reportingTo: string;
	branch: string;
	status: string;
	education: string;
	bio: string;
	profileImage: string;
}

const DEFAULT_STATUS = "Active Employee";
const DEFAULT_PROFILE_IMAGE = "/logos/profile-circle.svg";
const EMPTY_VALUE = "--";

/**
 * Get initials from a full name
 */
export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}

/**
 * Check if content contains HTML tags
 */
export function isHtmlContent(content: string): boolean {
	return content.includes("<");
}

/**
 * Transform API employee data to profile display format
 */
export function transformApiEmployeeToProfileData(
	apiEmployee: ApiEmployee
): EmployeeProfileData {
	const branchDepartment = apiEmployee.branch_departments?.[0];

	return {
		id: apiEmployee.id.toString(),
		name: apiEmployee.emp_name,
		role: apiEmployee.role,
		email: apiEmployee.email,
		phone: apiEmployee.phone,
		joinDate: new Date(apiEmployee.hire_date).toLocaleDateString(),
		department: branchDepartment?.department?.dept_name || "",
		reportingTo:
			branchDepartment?.manager?.employee.emp_name || EMPTY_VALUE,
		branch: branchDepartment?.branch?.branch_name || "",
		status: DEFAULT_STATUS,
		education: apiEmployee.education || "",
		bio: apiEmployee.bio || "",
		profileImage: apiEmployee.profile_picture || DEFAULT_PROFILE_IMAGE,
	};
}

/**
 * Profile constants
 */
export const PROFILE_CONSTANTS = {
	DEFAULT_STATUS,
	DEFAULT_PROFILE_IMAGE,
	EMPTY_VALUE,
} as const;

