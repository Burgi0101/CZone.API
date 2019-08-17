import { HttpException } from "../../app.exceptions";


export class ClubNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Club with ID: '${id}' not found`, {});
    }
}
