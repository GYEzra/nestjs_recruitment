import { IsMongoId, IsNotEmpty } from "class-validator"
import mongoose from "mongoose"

export class CreateResumeDto {
    @IsNotEmpty({ message: 'Url không được trống' })
    url: string

    @IsNotEmpty({ message: 'Company ID không được trống' })
    @IsMongoId({ message: 'Company ID phải là kiểu ObjectID' })
    company: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({ message: 'Job ID không được trống' })
    @IsMongoId({ message: 'Job ID phải là kiểu ObjectID' })
    job: mongoose.Schema.Types.ObjectId
}
