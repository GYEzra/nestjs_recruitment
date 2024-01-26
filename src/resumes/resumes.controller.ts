import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customise';
import { IUser } from 'src/users/user.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage('Tạo một Resume')
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách Resume với phân trang')
  findAll(@Query("current") current: string, @Query("pageSize") pageSize: string, @Query() queryString: string) {
    return this.resumesService.findAll(current, pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin Resume với ID')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Post('by-user')
  @ResponseMessage('Lấy thông tin CV với User ID')
  async findOneByUserId(@User() user: IUser) {
    return await this.resumesService.findOneByUserId(user._id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin Resume với ID')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto, @User() user: IUser) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa Resume với ID')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
