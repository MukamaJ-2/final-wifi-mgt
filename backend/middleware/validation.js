import { body, validationResult } from 'express-validator';

// Validation middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Admin registration validation
export const validateAdminRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^[a-zA-Z]+@\d+$/)
    .withMessage('Password must be in format: letters@numbers (e.g., admin@123)'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  handleValidationErrors
];

// Admin login validation
export const validateAdminLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Guest user creation validation
export const validateGuestUserCreation = [
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phoneNumber')
    .isLength({ min: 10, max: 20 })
    .matches(/^[\+]?[0-9\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  body('baseUsername')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage('Username must be 3-50 characters and contain only letters, numbers, dots, underscores, and hyphens'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('expirationDays')
    .isFloat({ min: 0.001, max: 365 })
    .withMessage('Expiration period must be between 0.001 and 365 days'),
  handleValidationErrors
];

// Guest user update validation
export const validateGuestUserUpdate = [
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('expiresAt must be a valid date'),
  handleValidationErrors
];