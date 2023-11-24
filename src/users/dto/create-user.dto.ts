import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateUserDto {
    @IsEmail({}, { message: "Email không đúng định dạng" })
    @IsNotEmpty({ message: "Email không được bỏ trống" })
    email: string;

    @IsNotEmpty({ message: "Password không được bỏ trống" })
    password: string;

    @IsNotEmpty({ message: "Name không được bỏ trống" })
    name: string;

    @IsNotEmpty({ message: "Age không được bỏ trống" })
    age: number;

    @IsNotEmpty({ message: "Address không được bỏ trống" })
    address: string;

    @IsNotEmpty({ message: "Gender không được bỏ trống" })
    gender: string;

    @IsNotEmpty({ message: "Role không được bỏ trống" })
    role: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}

export class RegisterUserDto {
    @IsEmail({}, { message: "Email không đúng định dạng" })
    @IsNotEmpty({ message: "Email không được bỏ trống" })
    email: string;

    @IsNotEmpty({ message: "Password không được bỏ trống" })
    password: string;

    @IsNotEmpty({ message: "Name không được bỏ trống" })
    name: string;

    @IsNotEmpty({ message: "Age không được bỏ trống" })
    age: number;

    @IsNotEmpty({ message: "Address không được bỏ trống" })
    address: string;

    @IsNotEmpty({ message: "Gender không được bỏ trống" })
    gender: string;
}
