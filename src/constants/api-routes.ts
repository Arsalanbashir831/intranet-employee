export const API_ROUTES = {
    AUTH: {
        OBTAIN_TOKEN: "/token/",
        REFRESH_TOKEN: "/token/refresh/",
        VERIFY_TOKEN: "/token/verify/",
        ME: "/me/",
        FORGOT_PASSWORD: '/forgot_password/',
        RESET_PASSWORD: '/reset_password/',
        CHANGE_PASSWORD: '/change_password/'
    },
    BRANCHES: {
        LIST: "/branches/",
        DETAIL: (id: number | string) => `/branches/${id}/`,
    },
    DEPARTMENTS: {
        LIST: "/departments/",
        DETAIL: (id: number | string) => `/departments/${id}/`,
        GET_ALL_EMPLOYEES: (id: number | string) => `/departments/employees/${id}/`,
        GET_ALL_DEPT_EMPLOYEES: (id: number | string) => `/departments/employees/${id}/`,
        GET_ALL_BRANCH_DEPT_EMPLOYEES: (id: number | string) => `/branchdepartments/employees/${id}`,
    },
    EMPLOYEES: {
        LIST: "/employees/",
        DETAIL: (id: number | string) => `/employees/${id}/`,
        UPLOAD_PICTURE: (id: number | string) => `/employees/${id}/profile_picture/upload/`,
        DELETE_PICTURE: (id: number | string) => `/employees/${id}/profile_picture/`,
    },
    MANAGERS: {
        LIST: "/managers/",
        DETAIL: (id: number | string) => `/managers/${id}/`,
    },
    KNOWLEDGE_BASE: {
        FOLDERS: {
            LIST: "/knowledge/folders/",
            DETAIL: (id: number | string) => `/knowledge/folders/${id}/`,
            FOLDER_TREE: "/knowledge/folders/tree/",
        },
        FILES: {
            LIST: "/knowledge/files/",
            DETAIL: (id: number | string) => `/knowledge/files/${id}/`,
        },
        ANNOUNCEMENTS: {
            LIST: "/knowledge/announcements/",
            DETAIL: (id: number | string) => `/knowledge/announcements/${id}/`,
            DELETE: (id: number | string) => `/knowledge/announcements/${id}/`,
            ATTACHMENTS: {
                LIST: (announcement_id: number | string, employee_id: number | string) => `/knowledge/announcement-attachments?announcement_id=${announcement_id}&employee_id=${employee_id}/`,
            },
        },
    },
    NEW_HIRE: {
        CHECKLISTS: {
            LIST: "/newhire/checklists/",
            DETAIL: (id: number | string) => `/newhire/checklists/${id}/`,
            UPDATE: (id: number | string) => `/newhire/checklists/${id}/`,
        },
        ATTACHMENTS: {
            LIST: "/newhire/attachments/",
            DETAIL: (id: number | string) => `/newhire/attachments/${id}/`,
        },
        FILES: {
            LIST: "/newhire/attachment-files/",
        },
    },
} as const;