import { UsersService } from "../users.service";
import User from "../../authentication/auth.model";
import UserDto from "../../authentication/auth.dto";
import { UserNotFoundException } from "../../authentication/auth.exceptions";

(User as any).findById = jest.fn();

describe("The UsersService", () => {

    const usersService = new UsersService();

    describe("when trying to get a not existing user", () => {
        it("should throw a UserNotFoundException", async () => {

            const id = "MockedID";

            (User as any).findById.mockReturnValue(undefined);

            await expect(usersService.getUserById(id))
                .rejects.toMatchObject(new UserNotFoundException(id));
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
                password: "Testing123!"
            };

            (User as any).findById.mockReturnValue(userMock);

            await expect(usersService.getUserById(id)).resolves.toMatchObject({
                ...userMock,
                password: undefined
            });
        });
    });
});