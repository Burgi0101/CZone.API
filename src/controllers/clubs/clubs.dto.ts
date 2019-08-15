import { IsString, IsArray, IsNumber } from "class-validator";

class ClubDto {
    @IsString()
    public name: string;

    @IsString()
    public category: string;

    @IsArray()
    public managers: string;

    @IsNumber()
    public type: string;
}

export default ClubDto;