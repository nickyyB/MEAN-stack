import mongoose, {Schema} from 'mongoose';
import IObjectModel from '../service/property.service';

const doorSchema = new Schema({
    height: {type: Number, default: 15},
    offsetX: {type: Number, default: 0},
    offsetY: {type: Number, default: 0},
    symbol: {type: String, required: true},
    width: {type: Number, default: 15},
    x: {type: Number, required: true},
    y: {type: Number, required: true},
});

export const squareSchema = new Schema({
    doors: [doorSchema],
    height: {type: Number, required: true},
    offsetX: {type: Number, default: 0},
    offsetY: {type: Number, default: 0},
    width: {type: Number, required: true},
    x: {type: Number, required: true},
    y: {type: Number, required: true},
});

const ObjectModel = new Schema({
    address: {type: String, required: true},
    numberOfRooms: {type: Number, required: true},
    sketch: {type: String},
    squareFootage: {type: Number, required: true},
    squaresMap: [squareSchema],
    type: {type: String, required: true},
    username: {type: String, require: true},
});

export default mongoose.model<IObjectModel>('ObjectModel', ObjectModel, 'properties');
