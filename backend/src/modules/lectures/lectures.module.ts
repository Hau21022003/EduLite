import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Lecture,
  LectureSchema,
} from 'src/modules/lectures/schemas/lecture.schema';
import { UsersModule } from 'src/modules/users/users.module';
import { QuizzesModule } from 'src/modules/quizzes/quizzes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
    UsersModule,
    QuizzesModule,
  ],
  controllers: [LecturesController],
  providers: [LecturesService],
})
export class LecturesModule {}
