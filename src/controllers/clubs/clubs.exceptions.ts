import { HttpException } from "../../app.exceptions";


export class ClubNotFoundException extends HttpException {
    constructor(message: string) {
        super(404, message || "Club not found", {});
    }
}

export class NotClubManagerException extends HttpException {
    constructor(message: string) {
        super(403, message || "Only club managers can change or delete a club", {});
    }
}

export class ClubAlreadyJoinedException extends HttpException {
    constructor(message: string) {
        super(403, message || "You already joined this club", {});
    }
}

