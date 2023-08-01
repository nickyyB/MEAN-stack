import IUser from './user.service';

export default interface IAgency extends IUser {
    name: string;
    address: {
        country: string;
        city: string;
        street: string;
        number: string;
    };
    PIB: string;
    description: string;
}
