import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface ErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}

// API Configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
    console.error('API Base URL is not defined in environment variables');
}

class Api {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.instance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.code === 'ERR_NETWORK') {
                    console.error('Network error - possible CORS issue:', error);
                    return Promise.reject({
                        message: 'Unable to connect to the server. Please check your connection.'
                    });
                }

                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/signin';
                }

                const message = (error.response?.data as ErrorResponse)?.message || 'Something went wrong';
                return Promise.reject({ message });
            }
        );
    }

    private async request<T>(
        method: 'get' | 'post' | 'put' | 'delete',
        url: string,
        data?: any,
        params?: any
    ): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.instance.request({
                method,
                url,
                data,
                params,
            });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Auth APIs
    async register(data: { fullName: string; email: string; dob: string }) {
        return this.request<{ message: string }>(
            'post',
            API_ENDPOINTS.AUTH.REGISTER,
            data
        );
    }

    async verifyOTP(data: { email: string; otp: string }) {
        return this.request<{ token: string }>(
            'post',
            API_ENDPOINTS.AUTH.VERIFY_OTP,
            data
        );
    }

    async resendOTP(email: string) {
        return this.request<{ message: string }>(
            'post',
            API_ENDPOINTS.AUTH.RESEND_OTP,
            { email }
        );
    }

    async initiateLogin(email: string) {
        return this.request<{ message: string }>(
            'post',
            API_ENDPOINTS.AUTH.LOGIN_INITIATE,
            { email }
        );
    }

    async verifyLogin(data: { email: string; otp: string }) {
        return this.request<{ token: string }>(
            'post',
            API_ENDPOINTS.AUTH.LOGIN_VERIFY,
            data
        );
    }

    async logout() {
        return this.request<{ message: string }>(
            'post',
            API_ENDPOINTS.AUTH.LOGOUT
        );
    }

    // Notes APIs
    async createNote(data: { title: string; content: string }) {
        return this.request<{ note: any }>(
            'post',
            API_ENDPOINTS.NOTES.CREATE,
            data
        );
    }

    async getNotes(params?: { page?: number; limit?: number }) {
        return this.request<{ notes: any[]; total: number }>(
            'get',
            API_ENDPOINTS.NOTES.GET_ALL,
            undefined,
            params
        );
    }

    async getNoteById(id: string) {
        return this.request<{ note: any }>(
            'get',
            API_ENDPOINTS.NOTES.GET_BY_ID(id)
        );
    }

    async updateNote(id: string, data: { title?: string; content?: string }) {
        return this.request<{ note: any }>(
            'put',
            API_ENDPOINTS.NOTES.UPDATE(id),
            data
        );
    }

    async deleteNote(id: string) {
        return this.request<{ message: string }>(
            'delete',
            API_ENDPOINTS.NOTES.DELETE(id)
        );
    }

    // User APIs
    async getUserProfile() {
        return this.request<{ user: any }>(
            'get',
            API_ENDPOINTS.USER.PROFILE
        );
    }

    async updateUserProfile(data: { fullName?: string; dateOfBirth?: string }) {
        return this.request<{ user: any }>(
            'put',
            API_ENDPOINTS.USER.UPDATE_PROFILE,
            data
        );
    }

    async changePassword(data: { currentPassword: string; newPassword: string }) {
        return this.request<{ message: string }>(
            'post',
            API_ENDPOINTS.USER.CHANGE_PASSWORD,
            data
        );
    }
}

export const api = new Api();