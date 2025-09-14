import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import {
  ContentType,
  Lecture,
} from 'src/modules/lectures/schemas/lecture.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuizzesService } from 'src/modules/quizzes/quizzes.service';

@Injectable()
export class LecturesService {
  constructor(
    @InjectModel(Lecture.name)
    private readonly lectureModel: Model<Lecture>,
    private readonly quizzesService: QuizzesService,
  ) {}

  async create(createLectureDto: CreateLectureDto) {
    if (
      createLectureDto.contentType === ContentType.QUIZ &&
      !createLectureDto.quiz
    ) {
      throw new BadRequestException('Quiz is required');
    }
    const created = new this.lectureModel(createLectureDto);
    await created.save();
    if (createLectureDto.contentType === ContentType.QUIZ) {
      await this.quizzesService.create(
        created._id.toString(),
        createLectureDto.quiz,
      );
    }
    return created;
  }

  findAll() {
    return `This action returns all lectures`;
  }

  findByCourse(courseId: string) {
    return this.lectureModel
      .find({ course: new Types.ObjectId(courseId) })
      .lean();
  }

  findOne(id: string) {
    return this.lectureModel.findById(id).lean();
  }

  async update(id: string, updateLectureDto: CreateLectureDto) {
    // return `This action updates a #${id} lecture`;
    const lecture = await this.lectureModel.findById(id);
    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }
    if (lecture.contentType === ContentType.QUIZ) {
      // Xoa quiz
    }
    if (updateLectureDto.contentType === ContentType.QUIZ) {
      // Them quiz
    }
    lecture.set(updateLectureDto);
    await lecture.save();
    return lecture;
  }

  remove(id: number) {
    return `This action removes a #${id} lecture`;
  }
}
