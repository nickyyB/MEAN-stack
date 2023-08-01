import express from 'express';
import {AdminController} from '../controller/admin.controller';
import {UserController} from '../controller/user.controller';
import clientFilter from '../middleware/auth.middleware';

const clientRouter = express.Router();

clientRouter.route('/users').post(clientFilter.clientFilter, (req, res) => new UserController().getUserByUsername(req, res));
clientRouter.route('/users').put(clientFilter.clientFilter, (req, res) => new AdminController().updateClient(req, res));
clientRouter.route('/review').post(clientFilter.clientFilter, (req, res) => new UserController().reviewAgency(req, res));
export default clientRouter;
