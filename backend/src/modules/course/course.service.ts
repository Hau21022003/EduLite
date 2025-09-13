import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/modules/course/schemas/course.schema';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    const created = new this.courseModel(createCourseDto);
    return created.save();
  }

  async findAll(query: PaginationQueryDto) {
    const total = await this.courseModel.countDocuments();

    const items = await this.courseModel
      .find()
      .sort({ createdAt: -1 })
      .skip(query.offset)
      .limit(query.pageSize)
      .lean()
      .exec();

    return { items, total };
  }

  async findOne(id: string) {
    const course = await this.courseModel.findById(id).lean().exec();

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const updated = await this.courseModel.findByIdAndUpdate(
      id,
      { $set: updateCourseDto },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return updated;
  }

  async remove(id: string) {
    const removed = await this.courseModel.findByIdAndDelete(id);

    if (!removed) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return removed;
  }
}
