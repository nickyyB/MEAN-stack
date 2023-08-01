import {Document} from 'mongoose';
import IObjectModel, {ISquare} from './property.service';

export default interface IJob extends Document {
    agencyUsername: string;
    clientUsername: string;
    dateFrom: Date;
    dateTo: Date;
    status: string;
    price: number;
    property: {
        id: string;
        sketch: string;
        squaresMap: [ISquare];
    };
    review: {
        comment: string;
        rate: number;
    };
}
