import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from './user.interface';
import { ConfigService } from '@nestjs/config';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/database/sample';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    private configService: ConfigService
  ) { }

  async create(createUserDto: CreateUserDto, userData: IUser) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const isExist = await this.userModel.findOne({ email: createUserDto.email });

    if (isExist) {
      throw new BadRequestException(`Email ${createUserDto.email} đã tồn tại!`);
    }

    let user = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: userData._id,
        email: userData.email
      }
    });

    return {
      _id: user._id,
      createdAt: user.createdAt
    };
  }

  async register(regsiterUserDto: RegisterUserDto) {
    const { name, email, password, age, gender, address } = regsiterUserDto;
    const hashPassword = this.getHashPassword(password);
    const isExist = await this.userModel.findOne({ email });

    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại!`);
    }

    const role = await this.roleModel.findOne({ name: USER_ROLE });

    let user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: role?._id
    })

    return user;
  }

  async findAll(limit: number, currentPage: number, queryString: string) {
    const { filter, projection, population, sort } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    //@ts-ignore: Unreachable code error
    // if (isEmpty(sort)) {
    //   // @ts-ignore: Unreachable code error
    //   sort = "-updatedAt"
    // }
    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      //.projection(projection)
      .select('-password')
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`ID #${id} không tồn tại`);

    return await this.userModel.findOne({ _id: id }).select('-password').populate({
      path: 'role',
      select: { _id: 1, name: 1 }
    });
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ email: username }).populate({ path: 'role', select: { name: 1 } });
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {

    return await this.userModel.updateOne({ _id: updateUserDto._id }, {
      ...updateUserDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id))
      throw new NotFoundException(`ID #${id} không tồn tại`);

    const emailAdmin = this.configService.get<string>('USERNAME_ADMIN');
    const checkUser: IUser = await this.userModel.findOne({ _id: id });

    if (checkUser && checkUser.email === emailAdmin)
      throw new BadRequestException('Bạn không được phép xóa tài khoản ADMIN');


    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })

    return this.userModel.softDelete({ _id: id });
  }

  isValidPassword = (password: string, hash: string) => {
    return compareSync(password, hash);
  }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  updateUserToken = async (_id: string, refreshToken: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken }).populate({ path: 'role', select: { name: 1 } });;
  }
}
