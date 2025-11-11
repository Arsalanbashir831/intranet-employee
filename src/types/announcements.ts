/**
 * Announcements service types
 */

export type Announcement = {
	id: number;
	title: string;
	body: string;
	type: string;
	hash_tags: string | null;
	is_active: boolean;
	inherits_parent_permissions: boolean;
	permitted_branches: number[];
	permitted_departments: number[];
	permitted_employees: number[];
	created_by: number | null;
	created_at: string;
	updated_at: string;
	attachments: AnnouncementAttachment[];
	effective_permissions: {
		branches: number[];
		departments: number[];
		employees: number[];
	};
	permitted_branches_details: Array<{
		id: number;
		branch_name: string;
		location: string | null;
	}>;
	permitted_departments_details: Array<{ id: number; dept_name: string }>;
	permitted_employees_details: Array<{
		id: number;
		emp_name: string;
		email: string;
		phone: string;
		role: string;
		profile_picture: string | null;
	}>;
	created_by_details: {
		id: number;
		username: string;
		email: string;
		first_name: string;
		last_name: string;
		is_active: boolean;
		is_staff: boolean;
		is_superuser: boolean;
	} | null;
};

export type AnnouncementAttachment = {
	id: number;
	announcement: number;
	name: string;
	description: string;
	file: string;
	file_url: string;
	inherits_parent_permissions: boolean;
	permitted_branches: number[];
	permitted_departments: number[];
	permitted_employees: number[];
	uploaded_by: number | null;
	uploaded_at: string;
	size: number;
	content_type: string;
	effective_permissions: {
		branches: number[];
		departments: number[];
		employees: number[];
	};
};

export type AnnouncementListResponse = {
	announcements: {
		count: number;
		page: number;
		page_size: number;
		results: Announcement[];
	};
};

export type AnnouncementDetailResponse = Announcement;

/**
 * Announcement component types (UI-specific)
 */

// Announcement card for dashboard display
export type AnnouncementCard = {
	id: string;
	image: string;
	title: string;
	description: string;
	badgeLines: [string, string, string];
};

// Announcement detail card props
export interface AnnouncementDetailCardProps {
	announcement: Announcement;
}

// Company Hub base item type (for table display)
export type CompanyHubItem = {
	id: string;
	title: string;
	description: string;
};

