import { IClub } from "./clubs.interfaces";

import Club, { ClubModel } from "./clubs.model";

import { ClubNotFoundException } from "./clubs.exceptions";


export class ClubsService {

    public async getClubs() {
        try {
            const clubs = await Club.find({});

            if (clubs) {
                return clubs;
            }
        }
        catch (err) {
            throw err;
        }
    }

    public async getClubById(id: string) {
        try {
            const club = await Club.findById(id);

            if (club) {
                return club;
            }
            else {
                throw new ClubNotFoundException(id);
            }
        }
        catch (err) {
            throw new ClubNotFoundException(id);
        }
    }

    public async createClub(club: ClubModel) {
        try {
            const persistedClub = await club.save();

            if (persistedClub) {
                return persistedClub;
            }
        }
        catch (err) {
            throw err;
        }
    }

    public async updateClub(club: IClub) {
        try {
            const updatedClub = await Club.findByIdAndUpdate(
                club._id,
                club,
                { new: true }
            );

            if (updatedClub) {
                return updatedClub;
            }
            else {
                throw new ClubNotFoundException(club._id);
            }
        }
        catch (err) {
            throw new ClubNotFoundException(club._id);
        }
    }

    public async deleteClub(id: string) {
        try {
            const deletedClub = await Club.findByIdAndDelete(id);

            if (deletedClub) {
                return deletedClub;
            }
            else {
                throw new ClubNotFoundException(id);
            }
        }
        catch (err) {
            throw new ClubNotFoundException(id);
        }
    }
}