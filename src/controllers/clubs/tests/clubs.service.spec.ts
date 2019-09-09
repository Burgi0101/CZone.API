import { ClubsService } from "../clubs.service";

import { Club } from "../clubs.model";
import ClubDto from "../clubs.dto";

(Club as any).find = jest.fn();
(Club as any).findById = jest.fn();
(Club as any).save = jest.fn();

describe("The AuthenticationService", () => {

    const clubsService = new ClubsService();

    describe("when trying to getClubs", () => {
        it("should return all clubs", async () => {

            const clubsMock: ClubDto[] = [{
                name: "",
                category: "",
                managers: [],
                type: 0
            }];

            (Club as any).find.mockReturnValue(clubsMock);

            await expect(clubsService.getClubs())
                .resolves.toMatchObject(clubsMock);
        });
    });
});