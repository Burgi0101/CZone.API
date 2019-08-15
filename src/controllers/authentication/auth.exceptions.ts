import { HttpException } from "../../middleware/error.middleware";

export class UserAlreadyExistingException extends HttpException {
    constructor(email: string) {
        super(403, `A user with the email: '${email}' already exists`, {});
    }
}

export class IncorrectCredentialsException extends HttpException {
    constructor() {
        super(403, `Incorrect user credentials`, {});
    }
}

export class NotAuthorizedException extends HttpException {
    constructor() {
        super(403, `Not authorized`, {});
    }
}
