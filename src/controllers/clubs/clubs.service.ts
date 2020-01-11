import { ClubModel, Club } from "./clubs.model";

import { ClubNotFoundException, NotClubManagerException } from "./clubs.exceptions";
import { TranslationService } from "../translation/translation.service";


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

    public async updateClub(club: ClubModel, lang = "en") {
        try {
            const updatedClub: ClubModel = await Club.findByIdAndUpdate(
                club._id,
                club,
                { new: true }
            );

            if (updatedClub) {
                return updatedClub;
            }
            else {
                throw new ClubNotFoundException(await this.translationService.getTranslations(lang, "clubNotFound"));
            }
        }
        catch (err) {
            throw new ClubNotFoundException(await this.translationService.getTranslations(lang, "clubNotFound"));
        }
    }

    public async deleteClub(id: string, user: any) {
        try {
            const club = await this.getClubById(id);

            if (club) {
                const isClubManager: boolean = club.managers.includes(user.email);

                if (isClubManager) {
                    const deletedClub: ClubModel = await Club.findByIdAndDelete(id);

                    if (deletedClub) {
                        return deletedClub;
                    }
                    else {
                        throw new ClubNotFoundException(await this.translationService.getTranslations(user.lang, "clubNotFound"));
                    }
                } else {
                    throw new NotClubManagerException(await this.translationService.getTranslations(user.lang, "notClubManager"));
                }
            }
        }
        catch (err) {
            throw err;
        }
    }
}