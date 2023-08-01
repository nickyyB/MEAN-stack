import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import loggerMiddleware from './middleware/logger.middleware';
import adminRouter from './router/admin.router';
import agencyRouter from './router/agency.router';
import authRouter from './router/auth.router';
import clientRouter from './router/client.router';
import guestRouter from './router/guest.router';
import propertyRouter from './router/property.router';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(loggerMiddleware);

mongoose.connect('mongodb://127.0.0.1:27017/pia_januar-februar_2023').then(
    () => mongoose.connection.once('open', () => {
        console.log('DB CONNECTION OK');
    }),
);

const router = express.Router();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

router.use('', authRouter);
router.use('/admin', adminRouter);
router.use('/client', clientRouter);
router.use('/agency', agencyRouter);
router.use('/properties', propertyRouter);
router.use('', guestRouter);

app.use('/api', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
