/**
 * Employees service types
 */

export type Employee = {
	id: number;
	emp_name: string;
	branch_department_ids: number[];
	hire_date: string;
	address: string;
	city: string;
	phone: string;
	email: string;
	role: string;
	education: string;
	bio: string | null;
	profile_picture: string | null;
	isAdmin: boolean;
	branch_departments: {
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
	}[];
};

export type EmployeeListResponse = {
	employees: {
		count: number;
		page: number;
		page_size: number;
		results: Employee[];
	};
};

export type EmployeeDetailResponse = {
	employee: Employee;
};

export type UpdateEmployeeRequest = {
	bio?: string | null;
	education?: string;
};

export type UpdateEmployeeResponse = {
	employee: Employee;
};

