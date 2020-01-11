import { IsString, IsEmail, IsDateString, IsArray } from "class-validator";

class UserDto {
    @IsEmail()
    public email: string;

    @IsString()
    public nickname: string;

    @IsString()
    public firstname: string;

    @IsString()
    public lastname: string;

    @IsDateString()
    public birthdate: Date;

    @IsArray()
    public clubs: string[];

    @IsString()
    public password: string;

    @IsString()
    public language: string;
}

export default UserDto;
