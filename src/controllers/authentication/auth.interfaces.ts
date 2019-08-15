export interface IUser {
    email: string;
    firstname: string;
    lastname: string;
    birthdate: Date;
    password: string;
}

export interface ITokenData {
    token: string;
    expiresIn: number;
}

export interface IDataStoredInToken {
    _id: string;
}
