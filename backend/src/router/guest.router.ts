import express from 'express';
import { GuestController } from '../controller/guest.controller';

const guestRouter = express.Router();

guestRouter.route('/agencies').get((req, res) => new GuestController().getAllAgencies(req, res));
guestRouter.route('/agencies/search').get((req, res) => new GuestController().searchAgencies(req, res));
guestRouter.route('/agencies/:pib').get((req, res) => new GuestController().getAgencyByPIB(req, res));

export default guestRouter;
