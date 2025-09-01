import express from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/user.controller';
import { auth, verifyEmail } from '../middleware/auth';
import { validate, ValidationMessages } from '../middleware/validate';

const router = express.Router();

// Validation schemas
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage(ValidationMessages.email)
        .normalizeEmail(),
    body('fullName')
        .notEmpty()
        .withMessage(ValidationMessages.required('Full name'))
        .isLength({ max: 100 })
        .withMessage(ValidationMessages.maxLength('Full name', 100))
        .trim(),
    body('dob')
        .notEmpty()
        .withMessage(ValidationMessages.required('Date of birth'))
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
            const date = new Date(value);
            const now = new Date();
            const minDate = new Date('1900-01-01');
            if (date > now) {
                throw new Error('Date of birth cannot be in the future');
            }
            if (date < minDate) {
                throw new Error('Date of birth cannot be before 1900');
            }
            return true;
        })
];

const initiateLoginValidation = [
    body('email')
        .isEmail()
        .withMessage(ValidationMessages.email)
        .normalizeEmail()
];

const otpValidation = [
    body('email')
        .isEmail()
        .withMessage(ValidationMessages.email)
        .normalizeEmail(),
    body('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits')
        .matches(/^\d+$/)
        .withMessage('OTP must contain only numbers')
];

const updateProfileValidation = [
    body('fullName')
        .optional()
        .notEmpty()
        .withMessage(ValidationMessages.required('Full name'))
        .isLength({ max: 100 })
        .withMessage(ValidationMessages.maxLength('Full name', 100))
        .trim(),
    body('dob')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
            const date = new Date(value);
            const now = new Date();
            const minDate = new Date('1900-01-01');
            if (date > now) {
                throw new Error('Date of birth cannot be in the future');
            }
            if (date < minDate) {
                throw new Error('Date of birth cannot be before 1900');
            }
            return true;
        })
];

// Public routes
router.post('/register', validate(registerValidation), userController.register);
router.post('/login/initiate', validate(initiateLoginValidation), userController.initiateLogin);
router.post('/login/verify', validate(otpValidation), userController.loginWithOtp);
router.post('/verify-otp', validate(otpValidation), userController.verifyOtp);
router.post('/resend-otp', validate([body('email').isEmail()]), userController.resendOtp);

// Protected routes
router.get('/me', auth, userController.getProfile);
router.patch('/me', auth, validate(updateProfileValidation), userController.updateProfile);
router.delete('/me', auth, userController.deleteAccount);

export default router;
