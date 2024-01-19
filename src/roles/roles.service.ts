import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/database/sample';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const checkRole = await this.roleModel.findOne({ name: createRoleDto.name });

    if (checkRole)
      throw new BadRequestException(`Role ${createRoleDto.name} đã tồn tại!`);

    let role = await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return {
      _id: role._id,
      createdAt: role.createdAt
    };
  }

  async findAll(current: string, pageSize: string, queryString: string) {
    const { filter, projection, population, sort } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    //@ts-ignore: Unreachable code error
    // if (isEmpty(sort)) {
    //   // @ts-ignore: Unreachable code error
    //   sort = "-updatedAt"
    // }
    const result = await this.roleModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .select(projection as any)
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
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException(`ID #${id} không tồn tại`);

    return (await this.roleModel.findOne({ _id: id }))?.populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException(`ID #${id} không tồn tại`);


    return await this.roleModel.updateOne({ _id: id }, {
      ...updateRoleDto,
      updatedBy: {
        _id: user._id,
        email: user._id
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException(`ID #${id} không tồn tại`);

    const role = await this.roleModel.findOne({ _id: id });

    if (role && role.name === ADMIN_ROLE)
      throw new BadRequestException('Bạn không được phép xóa Role ADMIN');

    await this.roleModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return this.roleModel.softDelete({ _id: id });
  }
}
