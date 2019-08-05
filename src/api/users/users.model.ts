import { Document, Schema, model } from "mongoose";

const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

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

UserSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) return next(err);

            // hash the password using our new salt
            bcrypt.hash(this.password, salt, function (err, hash) {
                if (err) return next(err);

                // override the cleartext password with the hashed one
                this.password = hash;
                next();
            });
        });
    }
    return next();
});

UserSchema.methods.comparePassword = function (userPassword, hashedPassword, next) {

    bcrypt.compare(userPassword, hashedPassword, function (err, isMatch) {
        if (err) {
            return next(err);
        }
        next(null, isMatch);
    });
};

export default model<UserModel>("User", UserSchema);