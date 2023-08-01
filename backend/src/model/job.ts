import mongoose, {Schema} from 'mongoose';
import IJob from '../service/job.service';

const doors = {
    height: {type: Number, default: 15},
    offsetX: {type: Number, default: 0},
    offsetY: {type: Number, default: 0},
    symbol: {type: String, required: true},
    width: {type: Number, default: 15},
    x: {type: Number, required: true},
    y: {type: Number, required: true},
};

const Job = new Schema({
    agencyUsername: {type: String, required: true},
    clientUsername: {type: String, required: true},
    dateFrom: {type: Date, required: true},
    dateTo: {type: Date, require: true},
    price: {type: Number, default: 0},
    property: {
        id: {type: String, required: true},
        sketch: {type: String},
        squaresMap: [{
            doors: [doors],
            height: {type: Number, required: true},
            offsetX: {type: Number, default: 0},
            offsetY: {type: Number, default: 0},
            status: {type: String, required: true, default: 'on hold'},
            width: {type: Number, required: true},
            x: {type: Number, required: true},
            y: {type: Number, required: true},
        }],
    },
    review: {
        comment: {type: String},
        rate: {type: Number},
    },
    status: {type: String, required: true},
});

export default mongoose.model<IJob>('Job', Job, 'jobs');
