import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { User } from '../models/User';
import ApiResponseUtil from '../utils/apiResponse';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
            token?: string;
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return ApiResponseUtil.unauthorized(res, 'Authentication required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await User.findOne({ _id: decoded.id, isActive: true });

        if (!user) {
            return ApiResponseUtil.unauthorized(res, 'User not found or inactive');
        }

        // Attach user and token to request object
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        return ApiResponseUtil.unauthorized(res, 'Invalid authentication token');
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        if (!req.user.isEmailVerified) {
            return ApiResponseUtil.forbidden(res, 'Email verification required');
        }
        return next();
    } catch (error) {
        return ApiResponseUtil.internalError(res, 'Error verifying email status');
    }
};

export const generateAuthToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN ? String(process.env.JWT_EXPIRES_IN) : '7d';

    return jwt.sign(
        { id: userId },
        secret as Secret,
        { expiresIn } as SignOptions
    );
};