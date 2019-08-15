import { HttpException } from "../../middleware/error.middleware";

export class UserAlreadyExistingException extends HttpException {
    constructor(email: string) {
        super(403, `A User with the email: '${email}' is already existing`, {});
    }
}

export class IncorrectCredentialsException extends HttpException {
    constructor() {
        super(403, `Incorrect user credentials!`, {});
    }
}