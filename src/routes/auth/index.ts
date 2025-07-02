import { Router } from 'express';
import { createUser, loginUser } from './authController';
import { validateCreateUser } from '../../middlewares/authValidationMiddleware';

const authRouter = Router();

authRouter.post('/register', validateCreateUser, createUser);

authRouter.post('/login', loginUser);

export default authRouter;
