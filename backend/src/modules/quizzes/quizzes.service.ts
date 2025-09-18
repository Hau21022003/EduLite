import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from 'src/modules/quizzes/schemas/quiz.schema';
import { Model, Types } from 'mongoose';
import { Question } from 'src/modules/quizzes/schemas/question.schema';
import { Answer } from 'src/modules/quizzes/schemas/answer.schema';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
  ) {}

  async create(lectureId: string, createQuizDto: CreateQuizDto) {
    const { questions, ...quizData } = createQuizDto;
    const quiz = new this.quizModel({ ...quizData, lecture: lectureId });
    await quiz.save();

    const questionsData = questions.map((question, idx) => ({
      ...question,
      quiz: quiz._id,
      orderIndex: idx,
    }));
    // await this.questionModel.
    await this.questionModel.insertMany(questionsData);

    return quiz;
  }

  findAll() {
    return `This action returns all quizzes`;
  }

  findOneByLecture(lectureId: string) {
    return this.quizModel
      .findOne({ lecture: new Types.ObjectId(lectureId) })
      .populate({
        path: 'questions',
        options: { sort: { orderIndex: 1 } },
      })
      .exec();
  }

  async removeByLecture(lectureId: string) {
    const quiz = await this.quizModel.findOne({
      lecture: new Types.ObjectId(lectureId),
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    // Xoa question va answer cua quiz
    // const oldQuestions = await this.questionModel.find({ quiz: quiz._id });
    // const questionIds = oldQuestions.map((q) => q._id);
    // await this.answerModel.deleteMany({ question: { $in: questionIds } });
    await this.questionModel.deleteMany({ quiz: quiz._id });
    await quiz.deleteOne();
    return quiz;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
