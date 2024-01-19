import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customise';
import { IUser } from 'src/users/user.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @ResponseMessage('Create A Role')
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return await this.rolesService.create(createRoleDto, user);
  }

  @Get()
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.rolesService.findAll(current, pageSize, queryString);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @ResponseMessage('Update A Role')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return await this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
