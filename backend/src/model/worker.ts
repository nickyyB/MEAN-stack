import mongoose, {Schema} from 'mongoose';
import {IWorker} from '../service/worker.service';

const workerSchema: Schema = new Schema({
    agencyUsername: {type: String, required: true},
    busy: {type: Boolean, default: false},
    contactPhone: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    speciality: {type: String, required: true},
    surname: {type: String, required: true},
});

const Worker = mongoose.model<IWorker>('Worker', workerSchema);

export default Worker;
