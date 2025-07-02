import { Router } from 'express';
import { createUser, loginUser } from './authController.js';
import { validateCreateUser } from '../../middlewares/authValidationMiddleware.js';

const authRouter = Router();

authRouter.post('/register', validateCreateUser, createUser);

authRouter.post('/login', loginUser);

export default authRouter;
