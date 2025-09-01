import { api } from './api';

export interface RegisterUserData {
    fullName: string;
    email: string;
    dob: string;  // Changed from dateOfBirth to dob
}

export interface VerifyOTPData {
    email: string;
    otp: string;
}

class UserService {
    async register(userData: RegisterUserData) {
        return api.register(userData);
    }

    async verifyOTP(verifyData: VerifyOTPData) {
        return api.verifyOTP(verifyData);
    }

    async resendOTP(email: string) {
        return api.resendOTP(email);
    }

    async initiateLogin(email: string) {
        return api.initiateLogin(email);
    }

    async verifyLogin(data: { email: string; otp: string }) {
        return api.verifyLogin(data);
    }

    async logout() {
        return api.logout();
    }

    async getProfile() {
        return api.getUserProfile();
    }

    async updateProfile(data: Partial<RegisterUserData>) {
        return api.updateUserProfile(data);
    }

    async getNotes(params: { page: number; limit: number }) {
        return api.getNotes(params);
    }

    async createNote(data: { content: string }) {
        return api.createNote(data);
    }

    async updateNote(id: string, data: { content?: string }) {
        return api.updateNote(id, data);
    }

    async deleteNote(id: string) {
        return api.deleteNote(id);
    }
}

export const userService = new UserService();