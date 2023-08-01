import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/server.config';

const adminFilter = (req: Request, res: Response, next: NextFunction) => {

    extractJWT('admin', req, res, next);

};

const clientFilter = (req: Request, res: Response, next: NextFunction) => {

    extractJWT('client', req, res, next);

};

const agencyFilter = (req: Request, res: Response, next: NextFunction) => {

    extractJWT('agency', req, res, next);

};

const extractJWT = (level: string, req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split('Bearer ')[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    error,
                    message: error,
                });
            } else {
                res.locals.jwt = decoded;
                if (res.locals.jwt.type !== level) {
                    return res.status(403).json({
                        message: 'Forbidden',
                    });
                }
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Wrong username and/or password',
        });
    }
};

export default {adminFilter, clientFilter, agencyFilter};
