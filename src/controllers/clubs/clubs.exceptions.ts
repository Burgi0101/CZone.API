import { HttpException } from "../../middleware/error.middleware";

export class ClubNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Club with ID: '${id}' not found`, {});
    }
}