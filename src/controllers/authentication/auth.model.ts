import { Document, Schema, model } from "mongoose";

export type UserModel = Document & {
    email: string;
    nickname: string;
    firstname: string;
    lastname: string;
    birthdate: Date;
    password: string;
};

export const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    nickname: { type: String },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birthdate: { type: Date, required: true },
    password: { type: String, required: true }
});

export default model<UserModel>("User", UserSchema);
