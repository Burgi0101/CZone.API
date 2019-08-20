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

    public async getClubById(id) {
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
}