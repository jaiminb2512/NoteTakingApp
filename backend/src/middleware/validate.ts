import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import ApiResponseUtil from '../utils/apiResponse';

interface FormattedError {
    field: string;
    message: string;
}

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Execute all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const formattedErrors: FormattedError[] = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg
        }));

        return ApiResponseUtil.validationError(
            res,
            'Validation failed',
            JSON.stringify(formattedErrors)
        );
    };
};

// Common validation messages
export const ValidationMessages = {
    required: (field: string) => `${field} is required`,
    invalid: (field: string) => `Invalid ${field}`,
    minLength: (field: string, length: number) => `${field} must be at least ${length} characters long`,
    maxLength: (field: string, length: number) => `${field} cannot exceed ${length} characters`,
    email: 'Please enter a valid email address',
    password: 'Password must be at least 6 characters long and contain at least one number',
    match: (field: string) => `${field} does not match`,
    exists: (field: string) => `${field} already exists`,
    notFound: (field: string) => `${field} not found`
};