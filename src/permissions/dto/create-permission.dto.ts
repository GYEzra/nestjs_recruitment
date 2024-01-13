import { IsNotEmpty, IsString } from "class-validator"

export class CreatePermissionDto {
    @IsNotEmpty({ message: 'Tên Permission không được bỏ trống' })
    name: string

    @IsNotEmpty({ message: 'ApiPath không được bỏ trống' })
    apiPath: string

    @IsNotEmpty({ message: 'Method không được bỏ trống' })
    method: string

    @IsNotEmpty({ message: 'Module không được bỏ trống' })
    module: string
}
