import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) { }

  async create(createJobDto: CreateJobDto, user: IUser) {
    let job = await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });

    return {
      _id: job._id,
      createdAt: job.createdAt
    };
  }

  async findAll(current: string, pageSize: string, queryString: string) {
    const { filter, projection, population, sort } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // @ts-ignore: Unreachable code error
    // if (isEmpty(sort)) {
    //   // @ts-ignore: Unreachable code error
    //   sort = "-updatedAt"
    // }
    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
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
      return this.jobModel.findOne({ _id: id });
    }
    else
      throw new NotFoundException(`ID #${id} không tồn tại`);
  }

  update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    if (mongoose.isValidObjectId(id)) {
      return this.jobModel.updateOne({ _id: id }, {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    }
    else
      throw new NotFoundException(`ID #${id} không tồn tại`);
  }

  remove(id: string, user: IUser) {
    if (mongoose.isValidObjectId(id)) {
      return this.jobModel.updateOne({ _id: id }, {
        isDeleted: true,
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });
    }
    else
      throw new NotFoundException(`ID #${id} không tồn tại`);
  }
}
