import { IsString, IsEmail, IsDateString } from "class-validator";

class RegisterUserDto {
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

    @IsString()
    public password: string;
}

export default RegisterUserDto;