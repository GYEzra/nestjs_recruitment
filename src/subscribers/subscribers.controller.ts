import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ResponseMessage, User } from 'src/decorator/customise';
import { IUser } from 'src/users/user.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @ResponseMessage("Create a subscriber")
  async create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return await this.subscribersService.create(createSubscriberDto, user);
  }

  @Get()
  @ResponseMessage("Fetch all subscriber")
  async findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return await this.subscribersService.findAll(current, pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage("Fetch a subscriber")
  async findOne(@Param('id') id: string) {
    return await this.subscribersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a subscriber")
  async update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return await this.subscribersService.update(id, updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a subscriber")
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.subscribersService.remove(id, user);
  }
}
