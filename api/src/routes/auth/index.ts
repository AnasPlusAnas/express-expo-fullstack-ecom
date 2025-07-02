import { Router } from 'express';
import { createUser, loginUser } from './authController.js';
import { validateData } from '../../middlewares/validateData.js';
import { createUserSchema, loginUserSchema } from '../../db/schema/users.js';
const authRouter = Router();

authRouter.post('/register', validateData(createUserSchema), createUser);

authRouter.post('/login', validateData(loginUserSchema), loginUser);

export default authRouter;
