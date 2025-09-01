import { User, IUser } from '../models/User';
import { emailService } from './email.service';
import { generateAuthToken } from '../middleware/auth';

interface CreateUserInput {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

interface LoginResponse {
    user: IUser;
    token: string;
}

class UserService {
    /**
     * Create a new user
     */
    async createUser(userData: CreateUserInput): Promise<IUser> {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        // Create new user
        const user = new User(userData);

        // Generate and set OTP
        const otp = user.generateOtp();

        // Save user
        await user.save();

        // Send OTP email
        try {
            await emailService.sendOtpEmail(user, otp);
        } catch (error) {
            // If email fails, still return user but log error
            console.error('Failed to send OTP email:', error);
        }

        return user;
    }

    /**
     * Login user
     */
    async loginUser(email: string, password: string): Promise<LoginResponse> {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = generateAuthToken(user._id);

        return { user, token };
    }

    /**
     * Verify OTP
     */
    async verifyOtp(email: string, otp: string): Promise<IUser> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isEmailVerified) {
            throw new Error('Email already verified');
        }

        if (user.otp !== otp || user.isOtpExpired()) {
            throw new Error('Invalid or expired OTP');
        }

        // Mark email as verified and clear OTP
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Send welcome email
        try {
            await emailService.sendWelcomeEmail(user);
        } catch (error) {
            console.error('Failed to send welcome email:', error);
        }

        return user;
    }

    /**
     * Resend OTP
     */
    async resendOtp(email: string): Promise<void> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isEmailVerified) {
            throw new Error('Email already verified');
        }

        // Generate new OTP
        const otp = user.generateOtp();
        await user.save();

        // Send OTP email
        await emailService.sendOtpEmail(user, otp);
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<IUser> {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    /**
     * Update user
     */
    async updateUser(id: string, updates: Partial<IUser>): Promise<IUser> {
        // Remove sensitive fields from updates
        const safeUpdates = { ...updates };
        delete safeUpdates.password;
        delete safeUpdates.otp;
        delete safeUpdates.otpExpiry;
        delete safeUpdates.isEmailVerified;

        const user = await User.findByIdAndUpdate(
            id,
            { $set: safeUpdates },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Change password
     */
    async changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Verify old password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        // Update password
        user.password = newPassword;
        await user.save();
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<void> {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            throw new Error('User not found');
        }
    }
}

export const userService = new UserService();
