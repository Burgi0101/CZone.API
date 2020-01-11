import { TranslationService } from "../translation/translation.service";

import { User, UserModel } from "../authentication/auth.model";

import { UserNotFoundException } from "../authentication/auth.exceptions";
import UserDto from "../authentication/auth.dto";


export class UsersService {

    translationService = new TranslationService();

    public async getUserById(id: string, lang: string) {
        try {
            const user: UserDto = await User.findById(id);

            if (user) {
                user.password = undefined;
                return user;
            }
            else {
                throw new UserNotFoundException(await this.translationService.getTranslations(lang, "userNotFound"));
            }
        }
        catch (err) {
            throw new UserNotFoundException(await this.translationService.getTranslations(lang, "userNotFound"));
        }
    }

    public async updateUser(user: UserModel) {
        try {
            const updatedUser: UserModel = await User.findByIdAndUpdate(
                user._id,
                user,
                { new: true }
            );

            if (updatedUser) {
                return updatedUser;
            }
            else {
                throw new UserNotFoundException(await this.translationService.getTranslations(user.language, "userNotFound"));
            }
        }
        catch (err) {
            throw err;
        }
    }
}