import { ClubModel, Club } from "./clubs.model";

import { ClubNotFoundException, ClubAlreadyJoinedException, NotClubManagerException } from "./clubs.exceptions";
import { TranslationService } from "../translation/translation.service";
import { UsersService } from "../users/users.service";

import UserDto from "../authentication/auth.dto";
import { UserModel } from "../authentication/auth.model";


export class ClubsService {

    translationService = new TranslationService();
    usersService = new UsersService();

    public async getClubs() {
        try {
            const clubs: ClubModel[] = await Club.find({});

            if (clubs) {
                return clubs;
            }
        }
        catch (err) {
            throw err;
        }
    }

    public async getClubById(id: string, lang = "en") {
        try {
            const club: ClubModel = await Club.findById(id);

            if (club) {
                return club;
            }
            else {
                throw new ClubNotFoundException(await this.translationService.getTranslations(lang, "clubNotFound"));
            }
        }
        catch (err) {
            throw new ClubNotFoundException(await this.translationService.getTranslations(lang, "clubNotFound"));
        }
    }

    public async createClub(club: ClubModel, lang = "en") {
        try {
            const persistedClub: ClubModel = await club.save();

            if (persistedClub) {
                return persistedClub;
            }
        }
        catch (err) {
            throw err;
        }
    }

    public async joinClub(clubId: string, user: UserModel) {
        try {
            const club: ClubModel = await Club.findById(clubId);

            if (club) {
                if (!club.users.includes(user.email)) {
                    club.users.push(user.email);

                    const updateClubResponse: ClubModel = await Club.findByIdAndUpdate(
                        club._id,
                        club,
                        { new: true }
                    );

                    if (updateClubResponse) {
                        user.clubs.push(clubId);
                        this.usersService.updateUser(user);

                        return updateClubResponse;
                    }
                }
                else {
                    throw new ClubAlreadyJoinedException(await this.translationService.getTranslations(user.language, "clubAlreadyJoined"));
                }
            }
            else {
                throw new ClubNotFoundException(await this.translationService.getTranslations(user.language, "clubNotFound"));
            }
        }
        catch (err) {
            throw err;
        }
    }

    public async updateClub(club: ClubModel, user: UserDto) {
        try {
            const clubToUpdate = await this.getClubById(club._id);

            if (clubToUpdate) {
                const isClubManager: boolean = clubToUpdate.managers.includes(user.email);

                if (isClubManager) {
                    const updatedClub: ClubModel = await Club.findByIdAndUpdate(
                        club._id,
                        club,
                        { new: true }
                    );

                    if (updatedClub) {
                        return updatedClub;
                    }
                    else {
                        throw new ClubNotFoundException(await this.translationService.getTranslations(user.language, "clubNotFound"));
                    }
                } else {
                    throw new NotClubManagerException(await this.translationService.getTranslations(user.language, "notClubManager"));
                }
            }
        }
        catch (err) {
            throw err;
        }
    }

    public async deleteClub(id: string, user: UserDto) {
        try {
            const clubToDelete = await this.getClubById(id);

            if (clubToDelete) {
                const isClubManager: boolean = clubToDelete.managers.includes(user.email);

                if (isClubManager) {
                    const deletedClub: ClubModel = await Club.findByIdAndDelete(id);

                    if (deletedClub) {
                        return deletedClub;
                    }
                    else {
                        throw new ClubNotFoundException(await this.translationService.getTranslations(user.language, "clubNotFound"));
                    }
                } else {
                    throw new NotClubManagerException(await this.translationService.getTranslations(user.language, "notClubManager"));
                }
            }
        }
        catch (err) {
            throw err;
        }
    }
}