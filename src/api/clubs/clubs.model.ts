import mongoose, { Document, Schema, model } from "mongoose";

export type ClubModel = Document & {
    name: string;
    category: string;
};

export const ClubSchema = new Schema({
    name: String,
    category: String
});

export default model<ClubModel>("Club", ClubSchema);