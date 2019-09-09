import { Document, Schema, model } from "mongoose";

export type TranslationModel = Document & {
    lang: string;
    langCode: string;
    label: string;
    message: string;
};

export const TranslationSchema = new Schema({
    lang: { type: String, required: true },
    langCode: { type: String, required: true },
    label: { type: String, required: true },
    message: { type: String, required: true }
});

export const Translation = model<TranslationModel>("Translation", TranslationSchema, "translation");

