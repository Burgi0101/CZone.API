import { Document, Schema, model } from "mongoose";

export type ClubModel = Document & {
    name: string;
    category: string;
    managers: string[];
    users: string[];
    type: number;
};

export const ClubSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    managers: { type: Array, required: true },
    users: { type: Array },
    type: { type: Number, required: true }
});

export const Club = model<ClubModel>("Club", ClubSchema, "clubs");
