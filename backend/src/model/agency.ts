import mongoose from 'mongoose';
import IAgency from '../service/agency.service';
import User from './user';

const Schema = mongoose.Schema;

const Agency = new Schema({
    PIB: {type: String, required: true, unique: true},
    address: {
        city: {type: String, required: true},
        country: {type: String, required: true},
        number: {type: String, required: true},
        street: {type: String, required: true},
    },
    description: {type: String, required: true},
    name: {type: String, required: true},
});

export default User.discriminator<IAgency>('Agency', Agency);
