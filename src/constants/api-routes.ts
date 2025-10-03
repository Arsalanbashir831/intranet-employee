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
    EMPLOYEES: {
        LIST: "/employees/",
        DETAIL: (id: number | string) => `/employees/${id}/`,
        UPLOAD_PICTURE: (id: number | string) => `/employees/${id}/profile_picture/upload/`,
        DELETE_PICTURE: (id: number | string) => `/employees/${id}/profile_picture/`,
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