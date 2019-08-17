import { HttpException } from "../../app.exceptions";


export class UserAlreadyExistingException extends HttpException {
    constructor(email: string) {
        super(403, `A user with the email: '${email}' already exists`, {});
    }
}

export class UserNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `User with ID: '${id}' not found`, {});
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
