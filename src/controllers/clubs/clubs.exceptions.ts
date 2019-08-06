import { HttpException } from "../../middleware/error/error.middleware";

export class ClubNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Club with id ${id} not found`);
    }
}