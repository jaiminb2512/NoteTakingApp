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
    body('password')
        .isLength({ min: 6 })
        .withMessage(ValidationMessages.password)
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),
    body('firstName')
        .optional()
        .isLength({ max: 50 })
        .withMessage(ValidationMessages.maxLength('First name', 50))
        .trim(),
    body('lastName')
        .optional()
        .isLength({ max: 50 })
        .withMessage(ValidationMessages.maxLength('Last name', 50))
        .trim()
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage(ValidationMessages.email)
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage(ValidationMessages.required('Password'))
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
    body('firstName')
        .optional()
        .isLength({ max: 50 })
        .withMessage(ValidationMessages.maxLength('First name', 50))
        .trim(),
    body('lastName')
        .optional()
        .isLength({ max: 50 })
        .withMessage(ValidationMessages.maxLength('Last name', 50))
        .trim()
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage(ValidationMessages.required('Current password')),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage(ValidationMessages.password)
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
];

// Public routes
router.post('/register', validate(registerValidation), userController.register);
router.post('/login', validate(loginValidation), userController.login);
router.post('/verify-otp', validate(otpValidation), userController.verifyOtp);
router.post('/resend-otp', validate([body('email').isEmail()]), userController.resendOtp);

// Protected routes
router.get('/me', auth, userController.getProfile);
router.patch('/me', auth, validate(updateProfileValidation), userController.updateProfile);
router.post('/change-password', auth, validate(changePasswordValidation), userController.changePassword);
router.delete('/me', auth, userController.deleteAccount);

export default router;
