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
    const orderIndex = await this.getOrderIndex(createLectureDto.course);

    const created = new this.lectureModel({ ...createLectureDto, orderIndex });
    await created.save();
    if (createLectureDto.contentType === ContentType.QUIZ) {
      await this.quizzesService.create(
        created._id.toString(),
        createLectureDto.quiz,
      );
    }
    return created;
  }

  async getOrderIndex(courseId: string) {
    const lecture = await this.lectureModel
      .findOne({
        course: new Types.ObjectId(courseId),
      })
      .sort({ orderIndex: -1 });
    return lecture ? lecture.orderIndex + 1 : 1;
  }

  async swapOrder(lectureId1: string, lectureId2: string) {
    const lecture1 = await this.lectureModel.findById(lectureId1);
    const lecture2 = await this.lectureModel.findById(lectureId2);

    if (!lecture1 || !lecture2) {
      throw new NotFoundException('Lecture not found');
    }

    // tráo đổi orderIndex
    const temp = lecture1.orderIndex;
    lecture1.orderIndex = lecture2.orderIndex;
    lecture2.orderIndex = temp;

    await Promise.all([lecture1.save(), lecture2.save()]);
    return { lecture1, lecture2 };
  }

  findAll() {
    return `This action returns all lectures`;
  }

  findByCourse(courseId: string) {
    return this.lectureModel
      .find({ course: new Types.ObjectId(courseId) })
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean();
  }

  async findOne(id: string) {
    const lecture: any = await this.lectureModel.findById(id).lean();
    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }
    if (lecture.contentType === ContentType.QUIZ) {
      const quiz = await this.quizzesService.findOneByLecture(id);
      lecture.quiz = quiz;
    }
    return lecture;
  }

  async update(id: string, updateLectureDto: CreateLectureDto) {
    const lecture = await this.lectureModel.findById(id);
    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }
    if (
      updateLectureDto.contentType === ContentType.QUIZ &&
      !updateLectureDto.quiz
    ) {
      throw new BadRequestException('Quiz is required');
    }

    if (lecture.contentType === ContentType.QUIZ) {
      // Xoa quiz
      await this.quizzesService.removeByLecture(id);
    }
    if (updateLectureDto.contentType === ContentType.QUIZ) {
      // Them quiz
      await this.quizzesService.create(id, updateLectureDto.quiz);
    }
    lecture.set(updateLectureDto);
    await lecture.save();
    return lecture;
  }

  async remove(id: string) {
    const lecture = await this.lectureModel.findById(id);
    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }
    if (lecture.contentType === ContentType.QUIZ) {
      // Xoa quiz
      await this.quizzesService.removeByLecture(id);
    }
    await lecture.deleteOne();
    return lecture;
  }
}
