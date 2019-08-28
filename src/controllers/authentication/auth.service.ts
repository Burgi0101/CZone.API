import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { ITokenData, IDataStoredInToken } from "./auth.interfaces";

import User, { UserModel } from "./auth.model";

import { UserAlreadyExistingException, IncorrectCredentialsException } from "./auth.exceptions";


export class AuthenticationService {

    public async register(user: UserModel) {
        try {
            user.password = await bcrypt.hash(user.password, 10);
            const persistedUser: UserModel = await user.save();

            if (persistedUser) {
                return {
                    userToken: persistedUser.id,
                    authToken: this.createAuthToken(persistedUser)
                };
            }
            else {
                throw new UserAlreadyExistingException(user.email);
            }
        }
        catch (err) {
            switch (err.code) {
                case 11000: throw new UserAlreadyExistingException(user.email);
                default: throw err;
            }
        }
    }

    public async login(email: string, password: string) {
        try {
            const userToLogin: UserModel = await User.findOne({ email });

            if (userToLogin) {
                const isPasswordMatching = await bcrypt.compare(password, userToLogin.password);

                if (isPasswordMatching) {
                    return {
                        userToken: userToLogin.id,
                        authToken: this.createAuthToken(userToLogin)
                    };
                }
                else {
                    throw new IncorrectCredentialsException();
                }
            }
            else {
                throw new IncorrectCredentialsException();
            }
        }
        catch (err) {
            throw new IncorrectCredentialsException();
        }
    }

    private createAuthToken(user: UserModel): ITokenData {
        const expiresIn: number = parseInt(process.env.AUTH_TOKEN_EXPIRY_IN_SEC);
        const secret: string = process.env.SECRET;
        const dataStoredInToken: IDataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}