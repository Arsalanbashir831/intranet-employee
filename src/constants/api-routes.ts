export const API_ROUTES = {
    AUTH: {
        OBTAIN_TOKEN: "/login/employee/",
        REFRESH_TOKEN: "/token/refresh/",
        VERIFY_TOKEN: "/token/verify/",
        ME: "/me/",
        FORGOT_PASSWORD: '/forgot_password/',
        RESET_PASSWORD: '/reset_password/',
        CHANGE_PASSWORD: '/change_password/'
    },
    DEPARTMENTS: {
        GET_ALL_BRANCH_DEPT_EMPLOYEES: (id: number | string) => `/branchdepartments/employees/${id}`,
    },
    EMPLOYEES: {
        DETAIL: (id: number | string) => `/employees/${id}/`,
        UPDATE: (id: number | string) => `/employees/${id}/`,
        UPLOAD_PICTURE: (id: number | string) => `/employees/${id}/profile_picture/upload/`,
        DELETE_PICTURE: (id: number | string) => `/employees/${id}/profile_picture/`,
    },
    KNOWLEDGE_BASE: {
        FOLDERS: {
           FOLDER_TREE: "/knowledge/folders/tree/",
        },
        ANNOUNCEMENTS: {
            LIST: "/knowledge/announcements/",
            DETAIL: (id: number | string) => `/knowledge/announcements/${id}/`,
        },
    },
    NEW_HIRE: {
        ATTACHEMENT_STATUS: {
            LIST: (id: number | string) => `/newhire/attachment-status/?employee_id=${id}`,
            UPDATE: (id: number | string) => `/newhire/attachment-status/${id}/`,
        },
    },
} as const;