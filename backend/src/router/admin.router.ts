import express from 'express';
import {AdminController} from '../controller/admin.controller';
import UserController from '../controller/user.controller';
import adminFilter from '../middleware/auth.middleware';

const adminRouter = express.Router();

adminRouter.route('/users').get(adminFilter.adminFilter, (req, res) => new AdminController().getAllUsersExceptAdmins(req, res));
adminRouter.route('/users').post(adminFilter.adminFilter, (req, res) => new UserController().getUserByUsername(req, res));
adminRouter.route('/users/:username').delete(adminFilter.adminFilter, (req, res) => new AdminController().deleteUser(req, res));
adminRouter.route('/users').put(adminFilter.adminFilter, (req, res) => new UserController().updateUser(req, res));


adminRouter.route('/users/waiting').get(adminFilter.adminFilter, (req, res) => new AdminController().getAllInactiveUsers(req, res));
adminRouter.route('/users/activate').post(adminFilter.adminFilter, (req, res) => new AdminController().activateUser(req, res));
adminRouter.route('/users/deactivate').post(adminFilter.adminFilter, (req, res) => new AdminController().deactivateUser(req, res));
adminRouter.route('/users/reject').post(adminFilter.adminFilter, (req, res) => new AdminController().rejectUser(req, res));

adminRouter.route('/users/clients').post(adminFilter.adminFilter, (req, res) => new AdminController().createClient(req, res));
adminRouter.route('/users/clients').get(adminFilter.adminFilter, (req, res) => new AdminController().getClients(req, res));
adminRouter.route('/users/clients').put(adminFilter.adminFilter, (req, res) => new AdminController().updateClient(req, res));

adminRouter.route('/users/agencies').get(adminFilter.adminFilter, (req, res) => new AdminController().getAgencies(req, res));
adminRouter.route('/users/agencies').post(adminFilter.adminFilter, (req, res) => new AdminController().createAgency(req, res));
adminRouter.route('/users/agencies').put(adminFilter.adminFilter, (req, res) => new AdminController().updateAgency(req, res));

adminRouter.route('/jobs').get(adminFilter.adminFilter, (req, res) => new AdminController().getJobs(req, res));

adminRouter.route('/workers/agency/:agencyUsername').get(adminFilter.adminFilter, (req, res) => new AdminController().getAllWorkersInAgency(req, res));
adminRouter.route('/workers').post(adminFilter.adminFilter, (req, res) => new AdminController().createWorker(req, res));
adminRouter.route('/workers/:email').delete(adminFilter.adminFilter, (req, res) => new AdminController().deleteWorkerByEmail(req, res));
adminRouter.route('/workers/:email').put(adminFilter.adminFilter, (req, res) => new AdminController().updateWorker(req, res));
adminRouter.route('/workers/:email').get(adminFilter.adminFilter, (req, res) => new AdminController().getWorkerByEmail(req, res));

export default adminRouter;
