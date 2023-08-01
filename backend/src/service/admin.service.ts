import IUser from './user.service';

export default interface IAdmin extends IUser {
    firstName: string;
    lastName: string;
}
