import { IsArray, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateSubscriberDto {

    @IsNotEmpty({ message: 'Email không được bỏ trống' })
    email: string;

    @IsNotEmpty({ message: 'Name không được bỏ trống' })
    name: string;

    @IsNotEmpty({ message: 'Skill không được bỏ trống' })
    @IsArray({ message: 'Skills phải là kiểu Array' })
    @IsMongoId({ each: true, message: 'Skill phải là kiểu ObjectId' })
    skills: mongoose.Schema.Types.ObjectId[];
}
