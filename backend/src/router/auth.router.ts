import express from 'express';
import controller from '../controller/auth.controller';

const authRouter = express.Router();

//authRouter.get('/validate', extractJWT, controller.validateToken);
authRouter.post('/login', controller.login);
authRouter.post('/register', controller.register);
authRouter.post('/changePassword', controller.changePassword);
export default authRouter;
