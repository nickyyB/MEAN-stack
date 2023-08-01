import bcryptjs from 'bcryptjs';
import {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import Agency from '../model/agency';
import Client from '../model/client';
import User from '../model/user';
import signJWT from '../service/auth.service';
import validatePassword from '../util/validation';

const login = (req: Request, res: Response, next: NextFunction) => {

    const {username, password, type} = req.body;

    User.findOne({username, type, active: 1})
        .exec()
        .then((user) => {

            bcryptjs.compare(password, user.password, (error, result) => {
                if (error) {
                    return res.status(500).json({
                        message: 'Error while decrypting password',
                    });
                } else if (result) {

                    signJWT(user, (err, token) => {
                        if (err) {
                            return res.status(500).json({
                                error: err,
                                message: err.message,
                            });
                        } else if (token) {
                            return res.status(200).json({
                                message: 'Auth successful',
                                token,
                                user,
                            });
                        }
                    });

                } else {
                    return res.status(401).json({
                        message: 'Wrong password',
                    });
                }
            });

        })
        .catch((err) => {
            console.log(err);
            res.status(404).json({
                error: 'User not found',
            });
        });
};

const register = (req: Request, res: Response, next: NextFunction) => {

    const {
        username,
        password,
        firstName,
        lastName,
        phone,
        email,
        image,
        type,
        name,
        description,
        PIB,
        address,
    } = req.body;

    if (type !== 'client' && type !== 'agency') {
        return res.status(400).json({message: 'User should be client or agency'});
    }
    const strongPassword = validatePassword(password);
    if (!strongPassword) {
        return res.status(400).json({message: 'Password should contain at least 1 number, 1 big letter, 1 special character and between 8 and 16 length'});
    }

    bcryptjs.hash(password, 10, (hashError, hash) => {

        if (hashError) {
            return res.status(400).json({
                error: hashError,
                message: hashError.message,
            });
        }

        let newUser;

        if (type === 'client') {
            newUser = new Client({
                _id: new mongoose.Types.ObjectId(),
                active: 0,
                email,
                firstName,
                image,
                lastName,
                password: hash,
                phone,
                type,
                username,
            });
        } else {
            newUser = new Agency({
                PIB,
                _id: new mongoose.Types.ObjectId(),
                active: 0,
                address,
                description,
                email,
                image,
                name,
                password: hash,
                phone,
                type: 'agency',
                username,
            });
        }

        return newUser
            .save()
            .then((user) => {
                return res.status(201).json({
                    user,
                });
            })
            .catch((error) => {
                return res.status(400).json({
                    error,
                    message: error.message,
                });
            });
    });
};

const changePassword = (req: Request, res: Response, next: NextFunction) => {

    const { username, oldPassword, newPassword, newCPassword } = req.body;

    User.findOne({username, active: 1})
        .exec()
        .then((user) => {

            bcryptjs.compare(oldPassword, user.password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Password Mismatch',
                    });
                } else if (result) {
                    if (newPassword === newCPassword) {

                        const strongPassword = validatePassword(newPassword);
                        if (!strongPassword) {
                            return res.status(400).json({message: 'Password should contain at least 1 number, 1 big letter, 1 special character and between 8 and 16 length'});
                        }

                        bcryptjs.hash(newPassword, 10, (hashError, hash) => {

                            if (hashError) {
                                return res.status(400).json({
                                    error: hashError,
                                    message: hashError.message,
                                });
                            }

                            User.findOneAndUpdate({username}, {$set: {password: hash}}, {new: true}, (err, usr) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (usr) {
                                        res.status(200).json(usr);
                                    } else {
                                        res.status(404).json({message: 'User not found with username: ' + username});
                                    }
                                }
                            });

                        });

                    } else {
                        return res.status(401).json({
                            message: 'Error: you have to repeat the same password',
                        });
                    }
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(404).json({
                error: 'User not found',
            });
        });

};

export default { register, login, changePassword };
