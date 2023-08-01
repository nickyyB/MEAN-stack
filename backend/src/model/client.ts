import mongoose from 'mongoose';
import IClient from '../service/client.service';
import User from './user';

const Schema = mongoose.Schema;

const Client = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

export default User.discriminator<IClient>('Client', Client);
