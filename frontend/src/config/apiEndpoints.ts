export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/users/register',
        VERIFY_OTP: '/users/verify-otp',
        RESEND_OTP: '/users/resend-otp',
        LOGIN_INITIATE: '/users/login/initiate',
        LOGIN_VERIFY: '/users/login/verify',
        LOGOUT: '/users/logout',
    },
    NOTES: {
        CREATE: '/notes',
        GET_ALL: '/notes',
        GET_BY_ID: (id: string) => `/notes/${id}`,
        UPDATE: (id: string) => `/notes/${id}`,
        DELETE: (id: string) => `/notes/${id}`,
    },
    USER: {
        PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        CHANGE_PASSWORD: '/users/change-password',
    },
} as const;
