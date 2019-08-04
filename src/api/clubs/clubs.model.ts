import { Document, Schema, model } from "mongoose";

export type ClubModel = Document & {
    name: string;
    category: string;
};

export const ClubSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
});

export default model<ClubModel>("Club", ClubSchema);