import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course, CourseSchema } from 'src/modules/course/schemas/course.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    UsersModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
