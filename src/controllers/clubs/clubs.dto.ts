import { IsString, IsArray, IsNumber } from "class-validator";

class CreateClubDto {
    @IsString()
    public name: string;

    @IsString()
    public category: string;

    @IsArray()
    public managers: string;

    @IsNumber()
    public type: string;
}

export default CreateClubDto;