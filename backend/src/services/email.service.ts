import * as SibApi from '@sendinblue/client';
import { IUser } from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

class EmailService {
    private apiInstance: SibApi.TransactionalEmailsApi;

    constructor() {
        const apiKey = process.env.BREVO_API_KEY;
        if (!apiKey) {
            throw new Error('BREVO_API_KEY is not defined in environment variables');
        }

        // Configure API key authorization
        const config = {
            apiKey: apiKey,
            apiUrl: 'https://api.sendinblue.com/v3'
        };

        this.apiInstance = new SibApi.TransactionalEmailsApi();
        this.apiInstance.setApiKey(SibApi.TransactionalEmailsApiApiKeys.apiKey, apiKey);
    }

    /**
     * Send OTP email to user
     */
    async sendOtpEmail(user: IUser, otp: string): Promise<void> {
        const sendSmtpEmail = {
            subject: 'Email Verification OTP',
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Email Verification</h2>
                    <p>Hello ${user.fullName.split(' ')[0] || 'there'},</p>
                    <p>Your verification code is:</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <p>Best regards,<br>${process.env.APP_NAME || 'Note Taking App'} Team</p>
                </div>
            `,
            sender: {
                name: process.env.APP_NAME || 'Note Taking App',
                email: process.env.BREVO_SENDER_EMAIL || 'noreply@notetakingapp.com'
            },
            to: [{
                email: user.email,
                name: user.fullName || user.email
            }]
        };

        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (error) {
            console.error('Error sending OTP email:', error);
            throw new Error('Failed to send OTP email');
        }
    }

    /**
     * Send welcome email to user
     */
    async sendWelcomeEmail(user: IUser): Promise<void> {
        const sendSmtpEmail = {
            subject: `Welcome to ${process.env.APP_NAME || 'Note Taking App'}`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to ${process.env.APP_NAME || 'Note Taking App'}!</h2>
                    <p>Hello ${user.fullName.split(' ')[0] || 'there'},</p>
                    <p>Thank you for joining our platform. We're excited to have you on board!</p>
                    <p>You can now start creating and managing your notes.</p>
                    <p>Best regards,<br>${process.env.APP_NAME || 'Note Taking App'} Team</p>
                </div>
            `,
            sender: {
                name: process.env.APP_NAME || 'Note Taking App',
                email: process.env.BREVO_SENDER_EMAIL || 'noreply@notetakingapp.com'
            },
            to: [{
                email: user.email,
                name: user.fullName || user.email
            }]
        };

        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (error) {
            console.error('Error sending welcome email:', error);
            // Don't throw error for welcome email as it's not critical
        }
    }
}

export const emailService = new EmailService();