import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }

  create(createResumeDto: CreateResumeDto, user: IUser) {
    return this.resumeModel.create({
      ...createResumeDto,
      email: user.email,
      user: user._id,
      status: 'PENDING',
      history: [{
        status: 'PENDING',
        updatedAt: new Date(),
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }],
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async findAll(current: string, pageSize: string, queryString: string) {
    const { filter, projection, population, sort } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // @ts-ignore: Unreachable code error
    // if (isEmpty(sort)) {
    //   // @ts-ignore: Unreachable code error
    //   sort = "-updatedAt"
    // }
    const result = await this.resumeModel.find(filter)
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

  findOne(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.resumeModel.findOne({ _id: id });
    }
    else
      throw new NotFoundException(`ID #${id} không tồn tại`);
  }

  async findOneByUserId(userId: string) {
    if (!mongoose.isValidObjectId(userId))
      throw new NotFoundException(`ID #${userId} không tồn tại`);
    return await this.resumeModel.findOne({ user: userId }).sort("-createdAt").populate([
      { path: "company", select: { name: 1 } },
      { path: "job", select: { name: 1 } },
    ]);
  }

  update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    if (mongoose.isValidObjectId(id)) {
      return this.resumeModel.updateOne({ _id: id }, {
        status: updateResumeDto.status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          "history": {
            status: updateResumeDto.status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      });
    }
    else
      throw new NotFoundException(`ID #${id} không tồn tại`);
  }

  async remove(id: string, user: IUser) {
    if (mongoose.isValidObjectId(id)) {
      await this.resumeModel.updateOne({ _id: id }, {
        deletedAt: new Date(),
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
      return this.resumeModel.softDelete({ _id: id });
    }
    else
      throw new NotFoundException(`ID #${id} không tồn tại`);
  }
}
