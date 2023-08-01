import * as express from 'express';
import Agency from '../model/agency';
import Client from '../model/client';
import Job from '../model/job';
import User from '../model/user';
import Worker from '../model/worker';
import IAgency from '../service/agency.service';
import IClient from '../service/client.service';
export class AdminController {

    public createClient = (req: express.Request, res: express.Response) => {

        const user: IClient = new Client({
            active: 1,
            email: req.body.email,
            firstName: req.body.firstName,
            image: req.body.image,
            lastName: req.body.lastName,
            password: req.body.password,
            phone: req.body.phone,
            type: 'client',
            username: req.body.username,
        });

        User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    res.status(400).json({message: 'User with that username/email already exist'});
                } else {
                    user.save((error, resp) => {
                        if (error) {
                            console.log(error);
                            res.status(400).json({message: error.message});
                        } else {
                            res.status(201).json(resp);
                        }
                    });
                }
            }
        });

    }

    public createAgency = (req: express.Request, res: express.Response) => {

        const agency: IAgency = new Agency({
            active: 1,
            address: req.body.address,
            description: req.body.description,
            email: req.body.email,
            image: req.body.image,
            orgName: req.body.orgName,
            orgPIB: req.body.orgPIB,
            password: req.body.password,
            phone: req.body.phone,
            type: 'agency',
            username: req.body.username,
        });

        User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    res.status(400).json({message: 'User with that username/email already exist'});
                } else {
                    agency.save((error, resp) => {
                        if (error) {
                            res.status(400).json({message: error.message});
                        } else {
                            res.status(201).json(resp);
                        }
                    });
                }
            }
        });

    }

    public getAllUsersExceptAdmins = (req: express.Request, res: express.Response) => {

        User.find({type: {$ne: 'admin'}}, (err, users) => {
            if (err) {
                console.log(err);
            } else {
                res.json(users);
            }
        });

    }

    public getClients = (req: express.Request, res: express.Response) => {

        Client.find({type: {$eq: 'client'}}, (err, users) => {
            if (err) {
                console.log(err);
            } else {
                res.json(users);
            }
        });

    }

    public getAgencies = (req: express.Request, res: express.Response) => {

        Agency.find({type: {$eq: 'agency'}}, (err, users) => {
            if (err) {
                console.log(err);
            } else {
                res.json(users);
            }
        });

    }

    public getAllInactiveUsers = (req: express.Request, res: express.Response) => {

        User.find({$or: [{active: 0}, {active: null}], type: {$ne: 'admin'}}, (err, users) => {
            if (err) {
                console.log(err);
            } else {
                res.json(users);
            }
        });

    }

    public activateUser = (req: express.Request, res: express.Response) => {

        User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                if (!user) {
                    res.status(404).json({message: 'User not found with that username/email'});
                } else {
                    User.updateOne(
                        {$or: [{username: req.body.username}, {email: req.body.email}]},
                        {$set: {active: 1}}, (error, resp) => {
                        if (error) {
                            console.log(error);
                        } else {
                            res.status(200).json({message: 'User updated'});
                        }
                    });
                }
            }
        });

    }

    public deactivateUser = (req: express.Request, res: express.Response) => {

        User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                if (!user) {
                    res.status(404).json({message: 'User not found with that email/username'});
                } else {
                    User.updateOne(
                        {$or: [{username: req.body.username}, {email: req.body.email}]},
                        {$set: {active: 0}}, (error, resp) => {
                            if (error) {
                                console.log(error);
                            } else {
                                res.status(200).json({message: 'User updated'});
                            }
                        });
                }
            }
        });

    }

    public rejectUser = (req: express.Request, res: express.Response) => {

        User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                if (!user) {
                    res.status(404).json({message: 'User not found with that email/username'});
                } else {
                    User.updateOne(
                        {$or: [{username: req.body.username}, {email: req.body.email}]},
                        {$set: {active: -1}}, (error, resp) => {
                        if (error) {
                            console.log(error);
                        } else {
                            res.status(200).json({message: 'User updated'});
                        }
                    });
                }
            }
        });

    }

    public updateAgency = (req: express.Request, res: express.Response) => {

        User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json({message: 'Agency with that email/username not found'});
                } else {
                    Agency.findOneAndUpdate({$or: [{username: req.body.username}, {email: req.body.email}]}, {
                        $set: {
                            address: req.body.address,
                            description: req.body.description,
                            image: req.body.image,
                            name: req.body.name,
                            phone: req.body.phone,
                        },
                    }, {new: true}, (error, resp) => {
                        if (error) {
                            console.log(error);
                        } else {
                            res.status(200).json(resp);
                        }
                    });
                }
            }
        });

    }

    public updateClient = (req: express.Request, res: express.Response) => {

        Client.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json({message: 'Client with that email/username not found'});
                } else {
                    Client.findOneAndUpdate({$or: [{username: req.body.username}, {email: req.body.email}]}, {
                        $set: {
                            firstName: req.body.firstName,
                            image: req.body.image,
                            lastName: req.body.lastName,
                            phone: req.body.phone,
                        },
                    }, {new: true}, (error, resp) => {
                        if (error) {
                            console.log(error);
                        } else {
                            res.status(200).json(resp);
                        }
                    });
                }
            }
        });

    }

    public deleteUser = (req: express.Request, res: express.Response) => {

        User.findOneAndDelete({username: req.params.username}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json(
                        {message: 'User not found with username ' + req.params.username},
                    );
                } else {
                    res.status(200).json(result);
                }
            }
        });

    }

    public getJobs = (req: express.Request, res: express.Response) => {

        Job.find( (err, jobs) => {
            if (err) {
                console.log(err);
            } else {
                res.json(jobs);
            }
        });

    }

    public createWorker = async (req: express.Request, res: express.Response) => {
        try {
            const { name, surname, email, contactPhone, speciality, busy, agencyUsername } = req.body;

            // Check if agency with the specified username exists
            const agency = await Agency.findOne({ username: agencyUsername });
            if (!agency) {
                return res.status(404).json({ error: 'Agency not found' });
            }

            // Create the worker
            const worker = new Worker({
                agencyUsername,
                busy,
                contactPhone,
                email,
                name,
                speciality,
                surname,
            });

            // Save the worker
            await worker.save();

            res.status(201).json({ message: 'Worker created successfully', worker });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public getAllWorkersInAgency = async (req: express.Request, res: express.Response) => {
        try {
            const workers = await Worker.find({agencyUsername: req.params.agencyUsername});
            res.status(200).json(workers);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public getWorkerByEmail = async (req: express.Request, res: express.Response) => {
        try {
            const worker = await Worker.findOne({email: req.params.email});
            if (!worker) {
                return res.status(404).json({ error: 'Worker not found' });
            }
            res.status(200).json(worker);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public deleteWorkerByEmail = async (req: express.Request, res: express.Response) => {
        try {
            const email = req.params.email;
            const worker = await Worker.findOneAndDelete({email});
            if (!worker) {
                return res.status(404).json({ error: 'Worker not found' });
            }
            res.status(200).json({ message: 'Worker deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public updateWorker = async (req: express.Request, res: express.Response) => {
        try {
            const email = req.params.email;
            const updateData = req.body;
            const worker = await Worker.findOneAndUpdate({email}, updateData, { new: true });
            if (!worker) {
                return res.status(404).json({ error: 'Worker not found' });
            }
            res.status(200).json(worker);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}
