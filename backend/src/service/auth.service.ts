import jwt from 'jsonwebtoken';
import config from '../config/server.config';
import IUser from './user.service';

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
    const timeSinceEpoch = new Date().getTime();
    const expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
    const expirationTimeInSeconds = Math.floor(expirationTime / 1000);

    try {
        jwt.sign(
            {
                type: user.type,
                username: user.username,
            },
            config.server.token.secret,
            {
                algorithm: 'HS256',
                expiresIn: expirationTimeInSeconds,
                issuer: config.server.token.issuer,
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            },
        );
    } catch (error) {
        callback(error, null);
    }
};

export default signJWT;
