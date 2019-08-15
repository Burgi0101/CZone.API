import { Document, Schema, model } from "mongoose";

export type ClubModel = Document & {
    name: string;
    category: string;
    managers: string[];
    type: number;
};

export const ClubSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    managers: { type: Array, required: true },
    type: { type: Number, required: true }
});

export default model<ClubModel>("Club", ClubSchema);
