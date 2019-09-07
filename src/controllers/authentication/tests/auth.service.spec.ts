import jwt from "jsonwebtoken";

import { AuthenticationService } from "../auth.service";

import User, { UserModel } from "../auth.model";
import UserDto from "../auth.dto";

import { UserAlreadyExistingException, IncorrectCredentialsException } from "../auth.exceptions";

(User as any).findOne = jest.fn();
(User as any).save = jest.fn();
(jwt as any).sign = jest.fn();

describe("The AuthenticationService", () => {

    const authService = new AuthenticationService();

    describe("when trying to register a user with an already existing email", () => {
        it("should throw a UserAlreadyExistingException", async () => {

            const userMock: UserDto = {
                email: "georg.buurgstalller@gmx.at",
                nickname: "Burgi",
                firstname: "Georg",
                lastname: "Burgstaller",
                birthdate: new Date(),
                password: "Testing123!"
            };

            (User as any).findOne.mockReturnValue(userMock);

            await expect(authService.register(userMock))
                .rejects.toMatchObject(new UserAlreadyExistingException(userMock.email));
        });

        it("should throw a UserAlreadyExistingException when failing on saving", async () => {

            const userMock: UserDto = {
                email: "georg.buurgstalller@gmx.at",
                nickname: "Burgi",
                firstname: "Georg",
                lastname: "Burgstaller",
                birthdate: new Date(),
                password: "Testing123!"
            };

            (User as any).findOne.mockReturnValue(undefined);
            jest.spyOn(User.prototype, "save")
                .mockImplementationOnce(() => Promise.reject({ code: 11000 }));

            await expect(authService.register(userMock))
                .rejects.toMatchObject(new UserAlreadyExistingException(userMock.email));
        });
    });

    describe("when logging in a user", () => {
        it("should throw a IncorrectCredentialsException if the provided email is not existing", async () => {

            const userMock: UserDto = {
                email: "georg.buurgstalller@gmx.at",
                nickname: "Burgi",
                firstname: "Georg",
                lastname: "Burgstaller",
                birthdate: new Date(),
                password: "Testing123!"
            };

            (User as any).findOne.mockReturnValue(undefined);

            await expect(authService.login(userMock.email, userMock.password))
                .rejects.toMatchObject(new IncorrectCredentialsException());
        });

        it("should throw a IncorrectCredentialsException if the provided password doesn't match", async () => {

            const userMock: UserDto = {
                email: "georg.buurgstalller@gmx.at",
                nickname: "Burgi",
                firstname: "Georg",
                lastname: "Burgstaller",
                birthdate: new Date(),
                password: "$2b$10$R01DPB/vzSkjxNZvzGNJXuhjfSVt7QjcGOe4kDoCaty0MXW5Tmvn6"
            };

            const wrongPassword = "ThatsTheWrongPassword!";
            (User as any).findOne.mockReturnValue(userMock);

            await expect(authService.login(userMock.email, wrongPassword))
                .rejects.toMatchObject(new IncorrectCredentialsException());
        });

        it("should return user and auth token if the provided userdata matches", async () => {
            const userMock: UserDto = {
                email: "georg.buurgstalller@gmx.at",
                nickname: "Burgi",
                firstname: "Georg",
                lastname: "Burgstaller",
                birthdate: new Date(),
                password: "$2b$10$R01DPB/vzSkjxNZvzGNJXuhjfSVt7QjcGOe4kDoCaty0MXW5Tmvn6"
            };

            const correctPassword = "Testing123!";
            const secret = "jwtSecret";
            const expiresIn = "3600";

            process.env.AUTH_TOKEN_EXPIRY_IN_SEC = expiresIn;
            process.env.SECRET = secret;

            (User as any).findOne.mockReturnValue(userMock);
            (jwt as any).sign.mockReturnValue({});

            await expect(authService.login(userMock.email, correctPassword))
                .resolves.toMatchObject({
                    authToken: {
                        expiresIn: parseInt(expiresIn),
                        token: {}
                    },
                    userToken: undefined
                });
        });
    });
});