const { validationResult, check } = require('express-validator');

exports.userSignupValidator = [
  // Validate and sanitize the user's name
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 to 50 characters')
    .trim(),

  // Validate and sanitize the user's email
  check('email')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),

  // Validate and sanitize the user's password
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ status: "FAILED",  error: errorMessages });
    }
    next(); // Proceed to the next middleware if there are no validation errors
  },
];


exports.passwordResetValidator = [
    // Check for the new password
    check('newPassword')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/\d/)
      .withMessage('Password must contain at least one number'),
  
    // Handle validation errors
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ error: errorMessages[0] }); // Show the first error that occurred
      }
      next(); // Proceed to the next middleware if there are no validation errors
    },
  ];