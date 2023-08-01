import express from 'express';
import { PropertyController } from '../controller/property.controller';
import clientFilter from '../middleware/auth.middleware';
import agencyFilter from '../middleware/auth.middleware';

const propertyRouter = express.Router();

propertyRouter.route('').post( (req, res) => new PropertyController().createProperty(req, res));
propertyRouter.route('/:username').get( (req, res) => new PropertyController().getPropertiesForUser(req, res));
propertyRouter.route('/:id').delete( (req, res) => new PropertyController().deleteProperty(req, res));

propertyRouter.route('/jobs').post( (req, res) => new PropertyController().requestService(req, res));
propertyRouter.route('/jobs/:username').get( (req, res) => new PropertyController().getServicesByUsername(req, res));
propertyRouter.route('/jobs').put((req, res) => new PropertyController().updateStatusOfService(req, res));
propertyRouter.route('/jobs/:id').delete( (req, res) => new PropertyController().deleteJob(req, res));

propertyRouter.route('/jobs/agency/:id').get( (req, res) => new PropertyController().getServiceById(req, res));
propertyRouter.route('/jobs/agency/:id').put( (req, res) => new PropertyController().updateJob(req, res));

export default propertyRouter;
