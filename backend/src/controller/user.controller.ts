import * as express from 'express';
import Client from '../model/client';
import User from '../model/user';
import Agency from "../model/agency";
import Admin from "../model/admin";
import Job from "../model/job";
import console from "console";

export class UserController {

    public getUserByUsername = (req: express.Request, res: express.Response) => {

        User.findOne({username: req.body.username}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json({message: 'User not found with username: ' + req.body.username});
                } else {
                    res.status(200).json(result);
                }
            }
        });

    }

    public updateUser = (req: express.Request, res: express.Response) => {

        Admin.findOne({username: req.body.username}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json({message: 'User not found with email: ' + req.body.email});
                } else {

                    Admin.findOneAndUpdate({username: req.body.username}, {
                        $set: {
                            firstName: req.body.firstName,
                            image: req.body.image,
                            lastName: req.body.lastName,
                            phone: req.body.phone,
                        },
                    }, {new: true} , (error, resp) => {
                        if (error) {
                            console.log(error);
                        } else {
                            if (resp) {
                                res.status(200).json(resp);
                            } else {
                                res.status(404).json({message: 'User not found with username: ' + req.body.username});
                            }
                        }
                    });

                }
            }
        });

    }

    public updateAgency = (req: express.Request, res: express.Response) => {

        const agency = new Agency(req.body);

        User.findOne({username: agency.username}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json({message: 'User not found with email: ' + req.body.email});
                } else {

                    User.findOneAndUpdate({username: agency.username}, {agency}, {new: true}, (error, resp) => {
                        if (error) {
                            console.log(error);
                        } else {
                            if (resp) {
                                res.status(200).json(resp);
                            } else {
                                res.status(404).json({message: 'User not found with username: ' + agency.username});
                            }
                        }
                    });

                }
            }
        });

    }

    public reviewAgency = (req: express.Request, res: express.Response) => {

        const comment = req.body.comment;
        const rate = req.body.rate;

        Job.findByIdAndUpdate(req.body.id, {
            $set: {
                'review.comment': comment,
                'review.rate': rate,
            },
        }, {new: true}, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                if (!result) {
                    res.status(404).json(
                        {message: 'Job not found with id ' + req.body.id},
                    );
                } else {
                    res.status(200).json(result);
                }
            }
        });

    }

}

export default UserController;
