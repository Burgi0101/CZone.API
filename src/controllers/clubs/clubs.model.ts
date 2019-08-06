import { Document, Schema, model } from "mongoose";

export type ClubModel = Document & {
    name: string;
    category: string;
    manager: string[];
    type: number;
};

export const ClubSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    manager: { type: String, required: true },
    type: { type: Number, required: true }
});

export default model<ClubModel>("Club", ClubSchema);