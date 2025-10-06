import apiCaller from "@/lib/api-caller";
import { API_ROUTES } from "@/constants/api-routes";

// Fetch employees by department
export async function getDepartmentEmployees(
	departmentId: number | string,
	params?: Record<string, string | number | boolean>
) {
	const query = params
		? `?${new URLSearchParams(
				Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
					acc[k] = String(v);
					return acc;
				}, {})
		  )}`
		: "";
	const res = await apiCaller<EmployeeListResponse>(
		`${API_ROUTES.DEPARTMENTS.GET_ALL_DEPT_EMPLOYEES(departmentId)}${query}`,
		"GET"
	);
	return res.data;
}

// Fetch employees by branch department
export async function getBranchDepartmentEmployees(
	branchDepartmentId: number | string,
	params?: Record<string, string | number | boolean>
) {
	const query = params
		? `?${new URLSearchParams(
				Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
					acc[k] = String(v);
					return acc;
				}, {})
		  )}`
		: "";
	const res = await apiCaller<EmployeeListResponse>(
		`${API_ROUTES.DEPARTMENTS.GET_ALL_BRANCH_DEPT_EMPLOYEES(
			branchDepartmentId
		)}${query}`,
		"GET"
	);
	return res.data;
}
// List all employees (API returns { employees: { ... } })
export type EmployeeListResponse = {
	employees: {
		count: number;
		page: number;
		page_size: number;
		results: Employee[];
	};
};

export async function listAllEmployees(
	params?: Record<string, string | number | boolean>
) {
	const query = params
		? `?${new URLSearchParams(
				Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
					acc[k] = String(v);
					return acc;
				}, {})
		  )}`
		: "";
	const res = await apiCaller<EmployeeListResponse>(
		`${API_ROUTES.EMPLOYEES.ALL}${query}`,
		"GET"
	);
	return res.data;
}

// Define types based on the API response
export type Employee = {
	id: number;
	emp_name: string;
	branch_department_id: number;
	hire_date: string;
	address: string;
	city: string;
	phone: string;
	email: string;
	role: string;
	education: string;
	bio: string | null;
	profile_picture: string | null;
	branch_department: {
		id: number;
		branch: {
			id: number;
			branch_name: string;
		};
		department: {
			id: number;
			dept_name: string;
		};
		manager: {
			id: number;
			employee: {
				id: number;
				emp_name: string;
				profile_picture: string | null;
				email: string;
				role: string;
			};
			branch_department: {
				id: number;
				branch: {
					id: number;
					branch_name: string;
				};
				department: {
					id: number;
					dept_name: string;
				};
			};
		} | null;
	};
};

export type EmployeeDetailResponse = {
	employee: Employee;
};

// Type for updating employee data
export type UpdateEmployeeRequest = {
	bio?: string | null;
	education?: string;
	// Add other fields that can be updated as needed
};

export type UpdateEmployeeResponse = {
	employee: Employee;
};

export async function getEmployee(id: number | string) {
	const res = await apiCaller<EmployeeDetailResponse>(
		API_ROUTES.EMPLOYEES.DETAIL(id),
		"GET"
	);
	return res.data;
}

// Profile picture upload function
export async function uploadProfilePicture(
	employeeId: number | string,
	file: File
) {
	const formData = new FormData();
	formData.append("profile_picture", file);

	const res = await apiCaller<{ profile_picture: string }>(
		API_ROUTES.EMPLOYEES.UPLOAD_PICTURE(employeeId),
		"POST",
		formData,
		{},
		"formdata"
	);

	return res.data;
}

// Profile picture delete function
export async function deleteProfilePicture(employeeId: number | string) {
	const res = await apiCaller<void>(
		API_ROUTES.EMPLOYEES.DELETE_PICTURE(employeeId),
		"DELETE"
	);

	return res.data;
}

// Update employee function
export async function updateEmployee(
	employeeId: number | string,
	data: UpdateEmployeeRequest
) {
	const res = await apiCaller<UpdateEmployeeResponse>(
		API_ROUTES.EMPLOYEES.UPDATE(employeeId),
		"PATCH",
		data
	);

	return res.data;
}
