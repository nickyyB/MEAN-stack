import mongoose from 'mongoose';
import IUser from '../service/user.service';

const Schema = mongoose.Schema;

const User = new Schema({
    active: {type: Number, required: true},
    email: {type: String, required: true, unique: true},
    image: {type: String},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    type: {type: String, required: true},
    username: {type: String, required: true, unique: true},
});

export default mongoose.model<IUser>('User', User, 'users');
