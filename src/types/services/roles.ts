/**
 * Roles service types
 */

export type Role = {
	id: number;
	name: string;
	is_manager: boolean;
	is_executive: boolean;
};

export type RoleListResponse = {
	roles: {
		count: number;
		page: number;
		page_size: number;
		results: Role[];
	};
};

