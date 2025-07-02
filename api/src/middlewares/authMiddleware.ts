import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
    req.role = decoded.role;
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
