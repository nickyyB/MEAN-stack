import express from 'express';
import {AdminController} from '../controller/admin.controller';
import {UserController} from '../controller/user.controller';
import agencyFilter from '../middleware/auth.middleware';

const agencyRouter = express.Router();

agencyRouter.route('/users').post(agencyFilter.agencyFilter, (req, res) => new UserController().getUserByUsername(req, res));
agencyRouter.route('/users').put(agencyFilter.agencyFilter, (req, res) => new AdminController().updateAgency(req, res));

export default agencyRouter;
