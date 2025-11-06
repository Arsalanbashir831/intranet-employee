export const API_ROUTES = {
	EXECUTIVE_MEMBERS: {
		LIST: "/executives/executives/",
		DETAIL: (id: number | string) => `/executives/executives/${id}/`,
		CREATE: "/executives/executives/",
		UPDATE: (id: number | string) => `/executives/executives/${id}/`,
		UPLOAD_PICTURE: (id: number | string) =>
			`/executives/executives/${id}/profile_picture/upload/`,
		DELETE_PICTURE: (id: number | string) =>
			`/executives/executives/${id}/profile_picture/`,
	},
	AUTH: {
		OBTAIN_TOKEN: "/login/employee/",
		REFRESH_TOKEN: "/token/refresh/",
		VERIFY_TOKEN: "/token/verify/",
		ME: "/me/",
		FORGOT_PASSWORD: "/forgot_password/",
		RESET_PASSWORD: "/reset_password/",
		CHANGE_PASSWORD: "/change_password/",
	},
	DEPARTMENTS: {
		LIST: "/departments/",
		GET_ALL_DEPT_EMPLOYEES: (id: number | string) =>
			`/departments/employees/${id}`,
		GET_ALL_BRANCH_DEPT_EMPLOYEES: (id: number | string) =>
			`/branchdepartments/employees/${id}`,
	},
	EMPLOYEES: {
		DETAIL: (id: number | string) => `/employees/${id}/`,
		UPDATE: (id: number | string) => `/employees/${id}/`,
		UPLOAD_PICTURE: (id: number | string) =>
			`/employees/${id}/profile_picture/upload/`,
		DELETE_PICTURE: (id: number | string) =>
			`/employees/${id}/profile_picture/`,
		ALL: "/employees/", // List all employees
	},
	KNOWLEDGE_BASE: {
		FOLDERS: {
			FOLDER_TREE: "/knowledge/folders/tree/",
		},
		ANNOUNCEMENTS: {
			LIST: "/knowledge/announcements/",
			DETAIL: (id: number | string) => `/knowledge/announcements/${id}/`,
		},
		POLLS: {
			LIST: "/knowledge/polls/",
			DETAIL: (id: number | string) => `/knowledge/polls/${id}/`,
			RESULTS: (id: number | string) => `/knowledge/polls/${id}/results/`,
			VOTE: (id: number | string) => `/knowledge/polls/${id}/vote/`,
		},
		COMMENTS: {
			LIST: "/knowledge/comments/",
			DETAIL: (id: number | string) => `/knowledge/comments/${id}/`,
			CREATE: "/knowledge/comments/",
			UPDATE: (id: number | string) => `/knowledge/comments/${id}/`,
			DELETE: (id: number | string) => `/knowledge/comments/${id}/`,
		},
	},
	NEW_HIRE: {
		ATTACHEMENT_STATUS: {
			LIST: (id: number | string) =>
				`/newhire/attachment-status/?employee_id=${id}`,
			UPDATE: (id: number | string) => `/newhire/attachment-status/${id}/`,
		},
		TRAINING_CHECKLIST: {
			LIST: "/newhire/training-checklist/",
			DETAIL: (id: number | string) => `/newhire/training-checklist/${id}/`,
		},
	},
} as const;
