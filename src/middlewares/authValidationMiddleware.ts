import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import jwt, { decode } from 'jsonwebtoken';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
};

export const validateCreateUser = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
  body('email')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email must be a string with max 255 characters'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6, max: 255 })
    .withMessage('Password must be a string between 6 and 255 characters'),
  body('address').optional().isString().withMessage('Address must be a string'),
  handleValidationErrors,
];

export const validateUpdateUser = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  body('name')
    .optional()
    .isString()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be a string between 1 and 255 characters'),
  body('description')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Description must be a string with max 1000 characters'),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('price')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  handleValidationErrors,
];

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        message: 'Access denied',
      });
      return;
    }

    // decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== 'object' || !decoded?.userId) {
      res.status(401).json({
        message: 'Access denied',
      });
      return;
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Access denied',
    });
  }
};

export const verifyIsSeller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isSeller = req.role === 'seller';

    if (!isSeller) {
      res.status(401).json({
        message: 'Not a seller, access denied',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({
      message: 'Access denied',
    });
  }
};
