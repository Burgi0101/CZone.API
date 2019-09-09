import { Translation } from "./translation.model";

export class TranslationService {
    public async getTranslations(langCode: string, label: string) {
        try {
            const translation = await Translation.findOne({ langCode, label });
            if (translation) {
                return translation.message;
            }
        }
        catch (err) {
            throw err;
        }
    }
}