import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const permission = await this.permissionModel.findOne({ apiPath: createPermissionDto.apiPath, method: createPermissionDto.method });

    if (permission)
      throw new BadRequestException('Permission đã tồn tại');

    let result = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return {
      _id: result.id,
      createdAt: result.createdAt
    }
  }

  async findAll(current: string, pageSize: string, queryString: string) {
    const { filter, projection, population, sort } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    //@ts-ignore: Unreachable code error
    // if (isEmpty(sort)) {
    //   // @ts-ignore: Unreachable code error
    //   sort = "-updatedAt"
    // }
    const result = await this.permissionModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      //.projection(projection)
      .exec();

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (mongoose.isValidObjectId(id))
      return await this.permissionModel.findOne({ _id: id })
    else
      throw new NotFoundException(`ID #${id} không tồn tại`);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (mongoose.isValidObjectId(id)) {
      return await this.permissionModel.updateOne({ _id: id },
        {
          ...updatePermissionDto,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        })
    }
    else
      throw new NotFoundException(`ID #${id} không tồn tại`);
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException(`ID #${id} không tồn tại`);

    await this.permissionModel.updateOne({ _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    return this.permissionModel.softDelete({ _id: id });
  }
}
