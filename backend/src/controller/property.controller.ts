import * as console from 'console';
import * as express from 'express';
import Agency from '../model/agency';
import Client from '../model/client';
import Job from '../model/job';
import ObjectModel from '../model/property';
import User from '../model/user';
import Worker from '../model/worker';
import IObjectModel from '../service/property.service';

export class PropertyController {

    public createProperty = (req: express.Request, res: express.Response) => {

        const property: IObjectModel = new ObjectModel({
            address: req.body.property.address,
            numberOfRooms: req.body.property.numberOfRooms,
            sketch: req.body.property.sketch,
            squareFootage: req.body.property.squareFootage,
            squaresMap: req.body.property.squaresMap,
            type: req.body.property.type,
            username: req.body.username,
        });

        User.findOne({username: req.body.username}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json({message: 'User not found with username: ' + req.body.username});
                } else {
                    property.save((error, resp) => {
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

    public getPropertiesForUser = (req: express.Request, res: express.Response) => {

        ObjectModel.find({username: req.params.username}, (err, objects) => {
            if (err) {
                console.log(err);
            } else {
                res.json(objects);
            }
        });

    }

    public deleteProperty = (req: express.Request, res: express.Response) => {

        ObjectModel.findByIdAndDelete(req.params.id, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json(
                        {message: 'Object not found with id ' + req.params.id},
                    );
                } else {
                    res.status(200).json(result);
                }
            }
        });

    }

    public requestService = (req: express.Request, res: express.Response) => {

        const job = new Job({
            agencyUsername: req.body.agencyUsername,
            clientUsername: req.body.clientUsername,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo,
            property: {
                id: req.body.property.id,
                sketch: req.body.property.sketch,
                squaresMap: req.body.property.squaresMap,
            },
            status: 'waiting',
        });

        Client.findOne({username: req.body.clientUsername}, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json({message: 'User not found with username: ' + req.body.userUsername});
                } else {
                    Agency.findOne({username: req.body.agencyUsername}, (err2, result2) => {
                        if (err2) {
                            console.log(err2);
                        } else {
                            if (!result2) {
                                res.status(404).json(
                                    {message: 'Agency not found with username: ' + req.body.agencyUsername},
                                );
                            } else {
                                job.save((error, resp) => {
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
            }
        });

    }

    public getServicesByUsername = (req: express.Request, res: express.Response) => {

        Job.find({
            $or: [
                {clientUsername: req.params.username},
                {agencyUsername: req.params.username}],
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        });
    }

    public updateStatusOfService = (req: express.Request, res: express.Response) => {

        const jobId = req.body.id;

        Job.findById(jobId, async (err, job) => {
            if (err) {
                console.log(err);
                return res.status(500).json({error: 'Internal Server Error'});
            }

            if (!job) {
                return res.status(404).json({message: 'Job not found'});
            }

            const skip = true; // job.status === 'accepted' && req.body.status === 'in progress'

            if (!skip) {
                // try {
                //     const workers = await Worker.find({busy: false, agencyUsername: job.agencyUsername});
                //     if (job.property.squaresMap.length <= workers.length) {
                //         const squaresCount = job.property.squaresMap.length;
                //         for (let i = 0; i < squaresCount; i++) {
                //             workers[i].busy = true;
                //             workers[i].save();
                //         }
                //         job.status = req.body.status;
                //         job.save();
                //     } else {
                //         job.status = 'on hold';
                //         job.save();
                //     }
                //     return res.status(200).json(job);
                // } catch (error) {
                //     console.error(error);
                //     return res.status(500).json({error: 'Internal Server Error'});
                // }
            } else {
                const price = req.body.price;

                if (price !== undefined && price > 0) {
                    Job.findByIdAndUpdate(req.body.id, {
                        $set: {
                            price,
                            status: req.body.status,
                        },
                    }, {new: true}, (error, result) => {
                        if (error) {
                            console.log(error);
                        } else {
                            if (!result) {
                                res.status(404).json(
                                    {message: 'Object not found with id ' + req.body.id},
                                );
                            } else {
                                res.status(200).json(result);
                            }
                        }
                    });
                } else {
                    Job.findByIdAndUpdate(req.body.id, {
                        $set: {
                            status: req.body.status,
                        },
                    }, {new: true}, (error, result) => {
                        if (error) {
                            console.log(error);
                        } else {
                            if (!result) {
                                res.status(404).json(
                                    {message: 'Object not found with id ' + req.body.id},
                                );
                            } else {
                                res.status(200).json(result);
                            }
                        }
                    });
                }
            }
        });
    }

    public getServiceById = (req: express.Request, res: express.Response) => {

        Job.findById(req.params.id, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                if (!result) {
                    res.status(404).json({message: 'Object not found with id ' + req.params.id});
                } else {
                    res.status(200).json(result);
                }
            }
        });

    }

    public updateJob = (req: express.Request, res: express.Response) => {

        const notCompleted = req.body.property.squaresMap.filter((elem) => elem.status !== 'completed');
        let status = 'in progress';

        if (notCompleted.length === 0) {
            status = 'completed';
        }

        Job.findByIdAndUpdate(req.params.id, {
            $set: {
                property: req.body.property,
                status,
            },
        }, {new: true}, async (error, result) => {
            if (error) {
                console.log(error);
            } else {
                if (!result) {
                    res.status(404).json(
                        {message: 'Object not found with id ' + req.body.id},
                    );
                } else {
                    // if (status === 'completed') {
                    //     const workers = await Worker.find({busy: true, agencyUsername: req.body.agencyUsername});
                    //     const squaresCount = req.body.property.squaresMap.length;
                    //     for (let i = 0; i < squaresCount; i++) {
                    //         workers[i].busy = false;
                    //         workers[i].save();
                    //     }
                    //     const jobsOnHold = await Job.find({status: 'on hold'});
                    //     const job = jobsOnHold.find((element) => element.property.squaresMap.length <= squaresCount);
                    // }

                    res.status(200).json(result);
                }
            }
        });

    }

    public deleteJob = (req: express.Request, res: express.Response) => {

        Job.findByIdAndDelete(req.params.id, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (!result) {
                    res.status(404).json(
                        {message: 'Job not found with id ' + req.params.id},
                    );
                } else {
                    res.status(200).json(result);
                }
            }
        });

    }

}
