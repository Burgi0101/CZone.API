import { UsersService } from "../users.service";
import { User } from "../../authentication/auth.model";
import UserDto from "../../authentication/auth.dto";
import { UserNotFoundException } from "../../authentication/auth.exceptions";
import { TranslationService } from "../../translation/translation.service";

jest.mock("../../translation/translation.service");
(User as any).findById = jest.fn();

describe("The UsersService", () => {

    const usersService = new UsersService();

    describe("when trying to get a not existing user", () => {
        it("should throw a UserNotFoundException", async () => {

            const id = "MockedID";
            const lang = "en";

            (User as any).findById.mockReturnValue(undefined);
            jest.spyOn(TranslationService.prototype, "getTranslations")
                .mockImplementationOnce(() => Promise.resolve(""));


            await expect(usersService.getUserById(id, lang))
                .rejects.toMatchObject(new UserNotFoundException(""));
        });
    });

    describe("when trying to get an existing user by Id", () => {
        it("should return the user", async () => {

            const id = "MockedID";

            const userMock: UserDto = {
                email: "georg.buurgstalller@gmx.at",
                nickname: "Burgi",
                firstname: "Georg",
                lastname: "Burgstaller",
                birthdate: new Date(),
                password: "Testing123!",
                language: "en"
            };

            (User as any).findById.mockReturnValue(userMock);

            await expect(usersService.getUserById(id, userMock.language)).resolves.toMatchObject({
                ...userMock,
                password: undefined
            });
        });
    });
});