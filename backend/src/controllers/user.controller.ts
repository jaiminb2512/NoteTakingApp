import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import ApiResponseUtil from '../utils/apiResponse';

export class UserController {
    /**
     * Register new user
     */
    async register(req: Request, res: Response) {
        try {
            const user = await userService.createUser(req.body);
            return ApiResponseUtil.created(res, user, 'User registered successfully. Please check your email for verification code.');
        } catch (error: any) {
            return ApiResponseUtil.badRequest(res, error.message);
        }
    }

    /**
     * Login user
     */
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const { user, token } = await userService.loginUser(email, password);
            return ApiResponseUtil.success(res, { user, token }, 'Login successful');
        } catch (error: any) {
            return ApiResponseUtil.unauthorized(res, error.message);
        }
    }

    /**
     * Verify OTP
     */
    async verifyOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            const user = await userService.verifyOtp(email, otp);
            return ApiResponseUtil.success(res, user, 'Email verified successfully');
        } catch (error: any) {
            return ApiResponseUtil.badRequest(res, error.message);
        }
    }

    /**
     * Resend OTP
     */
    async resendOtp(req: Request, res: Response) {
        try {
            const { email } = req.body;
            await userService.resendOtp(email);
            return ApiResponseUtil.success(res, null, 'OTP sent successfully');
        } catch (error: any) {
            return ApiResponseUtil.badRequest(res, error.message);
        }
    }

    /**
     * Get current user profile
     */
    async getProfile(req: Request, res: Response) {
        try {
            return ApiResponseUtil.success(res, req.user, 'Profile retrieved successfully');
        } catch (error: any) {
            return ApiResponseUtil.internalError(res, error.message);
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(req: Request, res: Response) {
        try {
            const user = await userService.updateUser(req.user._id, req.body);
            return ApiResponseUtil.success(res, user, 'Profile updated successfully');
        } catch (error: any) {
            return ApiResponseUtil.badRequest(res, error.message);
        }
    }

    /**
     * Change password
     */
    async changePassword(req: Request, res: Response) {
        try {
            const { currentPassword, newPassword } = req.body;
            await userService.changePassword(req.user._id, currentPassword, newPassword);
            return ApiResponseUtil.success(res, null, 'Password changed successfully');
        } catch (error: any) {
            return ApiResponseUtil.badRequest(res, error.message);
        }
    }

    /**
     * Delete user account
     */
    async deleteAccount(req: Request, res: Response) {
        try {
            await userService.deleteUser(req.user._id);
            return ApiResponseUtil.success(res, null, 'Account deleted successfully');
        } catch (error: any) {
            return ApiResponseUtil.internalError(res, error.message);
        }
    }
}

export const userController = new UserController();
