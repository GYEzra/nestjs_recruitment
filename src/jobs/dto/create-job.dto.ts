import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty({ message: 'ID không được bỏ trống' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Tên công ty không được bỏ trống' })
    @IsString({ message: 'Tên công ty không đúng định dạng' })
    name: string;

    @IsNotEmpty({ message: 'Logo công ty không được bỏ trống' })
    logo: string;
}

export class CreateJobDto {
    @IsArray({ message: 'Skills phải là 1 mảng danh sách' })
    @IsString({ each: true, message: 'Skill không đúng định dạng' })
    @ArrayMinSize(1, { message: 'Mảng phải có ít nhất 1 skill' })
    skills: string[];

    @IsNotEmptyObject({}, { message: 'Object không được bỏ trống' })
    @IsObject({ message: 'Company không đúng định dạng' })
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: 'Location không được bỏ trống' })
    @IsString({ message: 'Location không đúng định dạng' })
    location: string;

    @IsNotEmpty({ message: 'Salary không được bỏ trống' })
    @IsNumber({}, { message: 'Salary không đúng định dạng' })
    salary: number;

    @IsNotEmpty({ message: 'Quantity không được bỏ trống' })
    @IsNumber({}, { message: 'Quantity không đúng định dạng' })
    quantity: number;

    @IsNotEmpty({ message: 'Level không được bỏ trống' })
    @IsString({ message: 'Level không đúng định dạng' })
    level: string;

    @IsString({ message: 'Description không đúng định dạng' })
    description: string;

    @IsNotEmpty({ message: 'Ngày bắt đầu không được bỏ trống' })
    @IsDate({ message: 'Ngày bắt đầu không đúng định dạng' })
    @Type(() => Date)
    startDate: Date;

    @IsNotEmpty({ message: 'Ngày kết thúc không được bỏ trống' })
    @IsDate({ message: 'Ngày kết thúc không đúng định dạng' })
    @Type(() => Date)
    endDate: Date;

    @IsNotEmpty({ message: 'Trạng thái không được bỏ trống' })
    @IsBoolean({ message: 'Trạng thái không đúng định dạng' })
    isActive: boolean;
}
