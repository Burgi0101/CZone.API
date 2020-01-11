import { ClubModel, Club } from "./clubs.model";

import { ClubNotFoundException, NotClubManagerException } from "./clubs.exceptions";
import { TranslationService } from "../translation/translation.service";

import UserDto from "../authentication/auth.dto";


export class ClubsService {

    translationService = new TranslationService();

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