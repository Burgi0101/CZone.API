import { IsString } from "class-validator";

class TranslationDto {
    @IsString()
    public lang: string;

    @IsString()
    public langCode: string;

    @IsString()
    public label: string;

    @IsString()
    public message: string;
}

export default TranslationDto;
