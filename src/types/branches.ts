/**
 * Branches service types
 */

// Branch type specific to branches API (includes departments array)
export type Branch = {
	id: number;
	branch_name: string;
	employee_count: number;
	departments: Array<{
		id: number;
		dept_name: string;
		branch_department_id: number;
		employee_count: number;
		manager: {
			id: number;
			employee: {
				id: number;
				emp_name: string;
				profile_picture: string;
				email: string;
				role: string;
				role_id: number;
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
	}>;
};

export type BranchListResponse = {
	branches: {
		count: number;
		page: number;
		page_size: number;
		results: Branch[];
	};
};