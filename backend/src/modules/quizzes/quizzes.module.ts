import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from 'src/modules/quizzes/schemas/quiz.schema';
import { UsersModule } from 'src/modules/users/users.module';
import {
  Question,
  QuestionSchema,
} from 'src/modules/quizzes/schemas/question.schema';
import {
  Answer,
  AnswerSchema,
} from 'src/modules/quizzes/schemas/answer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
    UsersModule,
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
