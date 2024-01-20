import { IsNotEmpty } from 'class-validator';

export class UpdateResumeDto {
    @IsNotEmpty({ message: 'Url không được trống' })
    status: string
}
