import { HttpException } from "../../app.exceptions";


export class ClubNotFoundException extends HttpException {
    constructor(message: string) {
        super(404, message || "Club not found", {});
    }
}
