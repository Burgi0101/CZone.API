import User from "../authentication/auth.model";

import { UserNotFoundException } from "../authentication/auth.exceptions";
import UserDto from "../authentication/auth.dto";

export class UsersService {

    public async getUserById(id: string) {
        try {
            const user: UserDto = await User.findById(id);

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