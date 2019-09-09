import { HttpException } from "../../app.exceptions";


export class UserAlreadyExistingException extends HttpException {
    constructor(message: string) {
        super(403, message || "User already existing", {});
    }
}

export class UserNotFoundException extends HttpException {
    constructor(message: string) {
        super(404, message || "User not found", {});
    }
}

export class IncorrectCredentialsException extends HttpException {
    constructor(message: string) {
        super(403, message || "Incorrect Credentials", {});
    }
}

export class NotAuthorizedException extends HttpException {
    constructor(message) {
        super(403, message || "Not authorized", {});
    }
}
