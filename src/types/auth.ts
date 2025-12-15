/**
 * Authentication service types
 */

export type User = {
	id: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	is_active: boolean;
	is_staff: boolean;
	is_superuser: boolean;
	mfa_enabled?: boolean;
};

export type Executive = {
	id: number;
	name: string;
	address: string;
	city: string;
	phone: string;
	email: string;
	role: string;
	bio: string;
	profile_picture: string;
	created_at: string;
	updated_at: string;
};

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
	bio: string;
	profile_picture: string | null;
	isAdmin: boolean;
	is_executive: boolean;
	mfa_enabled?: boolean;
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

export type MeResponse = {
	user: User;
	employee: Employee | null;
	executive: Executive | null;
};

