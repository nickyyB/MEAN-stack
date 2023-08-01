import IUser from './user.service';

export default interface IClient extends IUser {
    firstName: string;
    lastName: string;
}
