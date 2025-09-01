// src/services/email.service.ts

import * as brevo from '@getbrevo/brevo';
import { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
    private apiInstance: brevo.TransactionalEmailsApi;

    constructor() {
        const apiKeyValue = process.env.BREVO_API_KEY;
        if (!apiKeyValue) {
            throw new Error('BREVO_API_KEY is not defined in environment variables');
        }

        // ✅ Pass API key as a string
        this.apiInstance = new brevo.TransactionalEmailsApi(apiKeyValue);
    }

    /**
     * Send OTP email to user
     */
    async sendOtpEmail(user: IUser, otp: string): Promise<void> {
        const sendSmtpEmail: brevo.SendSmtpEmail = {
            subject: 'Email Verification OTP',
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Email Verification</h2>
                    <p>Hello ${user.fullName?.split(' ')[0] || 'there'},</p>
                    <p>Your verification code is:</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">
                        ${otp}
                    </h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <p>Best regards,<br>${process.env.APP_NAME || 'Note Taking App'} Team</p>
                </div>
            `,
            sender: {
                name: process.env.APP_NAME || 'Note Taking App',
                email: process.env.BREVO_SENDER_EMAIL || 'noreply@notetakingapp.com',
            },
            to: [
                {
                    email: user.email,
                    name: user.fullName || user.email,
                },
            ],
        };

        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log(`OTP email sent to ${user.email}`);
        } catch (error) {
            console.error('Error sending OTP email:', error);
            throw new Error('Failed to send OTP email');
        }
    }

    /**
     * Send welcome email to user
     */
    async sendWelcomeEmail(user: IUser): Promise<void> {
        const sendSmtpEmail: brevo.SendSmtpEmail = {
            subject: `Welcome to ${process.env.APP_NAME || 'Note Taking App'}`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to ${process.env.APP_NAME || 'Note Taking App'}!</h2>
                    <p>Hello ${user.fullName?.split(' ')[0] || 'there'},</p>
                    <p>Thank you for joining our platform. We're excited to have you on board!</p>
                    <p>You can now start creating and managing your notes.</p>
                    <p>Best regards,<br>${process.env.APP_NAME || 'Note Taking App'} Team</p>
                </div>
            `,
            sender: {
                name: process.env.APP_NAME || 'Note Taking App',
                email: process.env.BREVO_SENDER_EMAIL || 'noreply@notetakingapp.com',
            },
            to: [
                {
                    email: user.email,
                    name: user.fullName || user.email,
                },
            ],
        };

        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log(`Welcome email sent to ${user.email}`);
        } catch (error) {
            console.error('Error sending welcome email:', error);
            // Don't throw error for welcome email as it's not critical
        }
    }
}

// ✅ Export singleton
export const emailService = new EmailService();
