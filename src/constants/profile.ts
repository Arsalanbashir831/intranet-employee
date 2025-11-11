/**
 * Profile component constants
 */

export interface DetailField {
	icon: string;
	label: string;
	value: string;
}

export const DETAIL_FIELDS: Omit<DetailField, "value">[] = [
	{ icon: "/icons/id-badge.svg", label: "User ID" },
	{ icon: "/icons/envelope.svg", label: "E-mail" },
	{ icon: "/icons/smartphone.svg", label: "Phone Number" },
	{ icon: "/icons/calendar.svg", label: "Join Date" },
	{ icon: "/icons/hierarchy.svg", label: "Department" },
	{ icon: "/icons/manager.svg", label: "Reporting to" },
	{ icon: "/icons/branch.svg", label: "Branch" },
];

