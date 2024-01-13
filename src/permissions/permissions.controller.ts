import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customise';
import { IUser } from 'src/users/user.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @ResponseMessage('Tạo mới một quyền')
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    return await this.permissionsService.create(createPermissionDto, user);
  }

  @ResponseMessage('Lấy danh sách tất cả quyền')
  @Get()
  findAll(@Query("current") current: string, @Query("pageSize") pageSize: string, @Query() queryString: string) {
    return this.permissionsService.findAll(current, pageSize, queryString);
  }

  @ResponseMessage('Lấy thông tin của quyền')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @ResponseMessage('Cập nhật một quyền')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @ResponseMessage('Xóa một quyền')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
