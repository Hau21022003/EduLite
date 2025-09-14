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

    for (const questionDto of questions) {
      const { answers, ...questionData } = questionDto;
      const question = new this.questionModel({
        ...questionData,
        quiz: quiz._id,
      });
      await question.save();

      // 3. Tạo answers
      for (const answerDto of answers) {
        const answer = new this.answerModel({
          ...answerDto,
          question: question._id,
        });
        await answer.save();
      }
    }

    return quiz;
  }

  findAll() {
    return `This action returns all quizzes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quiz`;
  }

  async updateQuiz(id: string, updateQuizDto: CreateQuizDto) {
    const quiz = await this.quizModel.findById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const { questions, ...quizData } = updateQuizDto;

    // Update quiz info
    quiz.set(quizData);
    await quiz.save();

    // Xoá questions cũ
    const oldQuestions = await this.questionModel.find({ quiz: quiz._id });
    for (const q of oldQuestions) {
      await this.answerModel.deleteMany({ question: q._id });
    }
    await this.questionModel.deleteMany({ quiz: quiz._id });

    // Tạo lại questions + answers
    for (const questionDto of questions) {
      const { answers, ...questionData } = questionDto;
      const question = new this.questionModel({
        ...questionData,
        quiz: quiz._id,
      });
      await question.save();

      for (const answerDto of answers) {
        const answer = new this.answerModel({
          ...answerDto,
          question: question._id,
        });
        await answer.save();
      }
    }

    return quiz;
  }

  async removeByLecture(lectureId: string) {
    const quiz = await this.quizModel.findOne({
      lecture: new Types.ObjectId(lectureId),
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
