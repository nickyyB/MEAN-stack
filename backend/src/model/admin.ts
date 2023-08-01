import mongoose from 'mongoose';
import IAdmin from '../service/admin.service';
import User from './user';

const Schema = mongoose.Schema;

const Admin = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

export default User.discriminator<IAdmin>('Admin', Admin);
