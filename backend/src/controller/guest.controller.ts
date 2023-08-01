import * as console from 'console';
import * as express from 'express';
import Agency from '../model/agency';
import Job from '../model/job';

export class GuestController {

    public getAllAgencies = (req: express.Request, res: express.Response) => {

        const sorter = this.getSorterObj(req.query.sort);

        const pageSize = (req.query.pageSize !== undefined && req.query.pageSize !== null) ? Number(req.query.pageSize) : 9;
        const currentPage = (req.query.page !== undefined && req.query.page !== null) ? Number(req.query.page) : 1;
        const skip = (currentPage - 1) * pageSize;

        Agency.find({ active: 1 })
            .sort(sorter)
            .skip(skip)
            .limit(pageSize)
            .exec((err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({error: 'An error occurred'});
                } else {
                    Agency.countDocuments({ active: 1 }, (error, totalCount) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json({error: 'An error occurred'});
                        } else {
                            const totalPages = Math.ceil(totalCount / pageSize);
                            res.status(200).json({
                                agencies: result,
                                currentPage,
                                pageSize,
                                totalCount,
                                totalPages,
                            });
                        }
                    });
                }
            });

    }

    public getAgencyByPIB = (req: express.Request, res: express.Response) => {

        const pib = req.params.pib;

        Agency.findOne({ PIB: pib, active: 1 }, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({error: 'Internal Server Error'});
            } else {
                if (result) {
                    // res.status(200).json(result);
                    const agencyUsername = result.username;
                    Job.find({agencyUsername}, 'review clientUsername', (jobErr, jobResult) => {
                        if (jobErr) {
                            console.log(jobErr);
                            res.status(500).json({ error: 'Internal Server Error' });
                        } else {
                            const reviewsResult = jobResult.filter((item) => item.review.comment !== undefined);
                            res.status(200).json({ agency: result, reviews: reviewsResult });
                        }
                    });
                } else {
                    res.status(404).json({error: 'Agency not found'});
                }
            }
        });

    }

    public getAgenciesByAddress = (req: express.Request, res: express.Response) => {

        const sorter = this.getSorterObj(req.query.sort);

        const pageSize = (req.query.pageSize !== undefined && req.query.pageSize !== null) ? Number(req.query.pageSize) : 9;
        const currentPage = (req.query.page !== undefined && req.query.page !== null) ? Number(req.query.page) : 1;
        const skip = (currentPage - 1) * pageSize;

        const query = {
            $and: [
                {active: 1},
            ],
            $or: [
                {'address.country': {$regex: '.*' + req.query.address + '.*', $options: 'i'}},
                {'address.city': {$regex: '.*' + req.query.address + '.*', $options: 'i'}},
                {'address.street': {$regex: '.*' + req.query.address + '.*', $options: 'i'}},
                {'address.number': {$regex: '.*' + req.query.address + '.*', $options: 'i'}},
            ],
        };

        Agency.countDocuments(query, (err, totalCount) => {
            if (err) {
                console.log(err);
                res.status(500).json({error: 'An error occurred while counting documents.'});
                return;
            }

            Agency.find(query)
                .sort(sorter)
                .skip(skip)
                .limit(pageSize)
                .exec((error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({error: 'An error occurred while retrieving agencies.'});
                    } else {
                        const totalPages = Math.ceil(totalCount / pageSize);
                        res.status(200).json({
                            agencies: result,
                            currentPage,
                            pageSize,
                            totalCount,
                            totalPages,
                        });
                    }
                });
        });

    }

    public getAgenciesByName = (req: express.Request, res: express.Response) => {

        const sorter = this.getSorterObj(req.query.sort);

        const pageSize = (req.query.pageSize !== undefined && req.query.pageSize !== null) ? Number(req.query.pageSize) : 9;
        const currentPage = (req.query.page !== undefined && req.query.page !== null) ? Number(req.query.page) : 1;
        const skip = (currentPage - 1) * pageSize;

        const query = {
            active: 1,
            name: {
                $options: 'i',
                $regex: '.*' + req.query.name + '.*',
            },
        };

        Agency.countDocuments(query, (err, totalCount) => {
            if (err) {
                console.log(err);
                res.status(500).json({error: 'An error occurred while counting documents.'});
                return;
            }

            Agency.find(query)
                .sort(sorter)
                .skip(skip)
                .limit(pageSize)
                .exec((error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({error: 'An error occurred while retrieving agencies.'});
                    } else {
                        const totalPages = Math.ceil(totalCount / pageSize);
                        res.status(200).json({
                            agencies: result,
                            currentPage,
                            pageSize,
                            totalCount,
                            totalPages,
                        });
                    }
                });
        });

    }

    public getAgenciesByNameAndAddress = (req: express.Request, res: express.Response) => {

        const sorter = this.getSorterObj(req.query.sort);

        const pageSize = (req.query.pageSize !== undefined && req.query.pageSize !== null) ? Number(req.query.pageSize) : 9;
        const currentPage = (req.query.page !== undefined && req.query.page !== null) ? Number(req.query.page) : 1;
        const skip = (currentPage - 1) * pageSize;

        const query = {
            $or: [
                {'address.country': {$regex: '.*' + req.query.address + '.*', $options: 'i'}},
                {'address.city': {$regex: '.*' + req.query.address + '.*', $options: 'i'}},
                {'address.street': {$regex: '.*' + req.query.address + '.*', $options: 'i'}},
                {'address.number': {$regex: '.*' + req.query.address + '.*', $options: 'i'}},
            ],
            active: 1,
            name: {$regex: '.*' + req.query.name + '.*', $options: 'i'},
        };

        Agency.countDocuments(query, (err, totalCount) => {
            if (err) {
                console.log(err);
                res.status(500).json({error: 'An error occurred while counting documents.'});
                return;
            }

            Agency.find(query)
                .sort(sorter)
                .skip(skip)
                .limit(pageSize)
                .exec((error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({error: 'An error occurred while retrieving agencies.'});
                    } else {
                        const totalPages = Math.ceil(totalCount / pageSize);
                        res.status(200).json({
                            agencies: result,
                            currentPage,
                            pageSize,
                            totalCount,
                            totalPages,
                        });
                    }
                });
        });

    }

    public searchAgencies = (req: express.Request, res: express.Response) => {

        const {name, address} = req.query;

        if ((name === null || name === undefined) && (address === undefined || address === null)) {
            console.log('GET ALL AGENCIES');
            this.getAllAgencies(req, res);
        } else if ((name === null || name === undefined) && (address !== null && address !== undefined)) {
            console.log('GET BY ADDRESS AGENCIES');
            this.getAgenciesByAddress(req, res);
        } else if ( (name !== null && name !== undefined) && (address === null || address === undefined)) {
            console.log('GET BY NAME AGENCIES');
            this.getAgenciesByName(req, res);
        } else {
            console.log('GET BY BOTH PARAMS AGENCIES');
            this.getAgenciesByNameAndAddress(req, res);
        }

    }

    private getSorterObj(s: any) {
        const sortParam = s?.toString();
        const sortParts = sortParam ? sortParam.split(':') : [];
        const sorter = {};
        const stype = sortParts[0] || null;
        if (stype !== null) {
            const sdir = (sortParts[1] === 'asc') ? 1 : -1;
            sorter[stype] = sdir;
        }
        return sorter;
    }

}
