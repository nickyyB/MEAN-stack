import {Document} from 'mongoose';

export default interface IObjectModel extends Document {
    type: string;
    address: string;
    numberOfRooms: number;
    squareFootage: number;
    sketch: string;
    squaresMap: Map<number, ISquare>;
}

export interface ISquare {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    doors: Map<number, IDoor>;
    width: number;
    height: number;
    status: string;
}

export interface IDoor {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    symbol: string;
}
