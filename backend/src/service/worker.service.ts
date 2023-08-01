import {Document} from 'mongodb';

export interface IWorker extends Document {
    name: string;
    surname: string;
    email: string;
    contactPhone: string;
    speciality: string;
    busy: boolean;
    agencyUsername: string;
}
