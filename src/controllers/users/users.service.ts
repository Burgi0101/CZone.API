import { IUser } from "../authentication/auth.interfaces";

import User, { UserModel } from "../authentication/auth.model";

import { UserNotFoundException } from "../authentication/auth.exceptions";

export class UsersService {

    public async getUserById(id: string) {
        try {
            const user: IUser = await User.findById(id);

            if (user) {
                user.password = undefined;
                return user;
            }
            else {
                throw new UserNotFoundException(id);
            }
        }
        catch (err) {
            throw new UserNotFoundException(id);
        }
    }
}