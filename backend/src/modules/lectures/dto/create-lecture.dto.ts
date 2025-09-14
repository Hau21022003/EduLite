import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsExists } from 'src/common/validators/is-exist-constraint.validator';
import { Course } from 'src/modules/course/schemas/course.schema';
import { ContentType } from 'src/modules/lectures/schemas/lecture.schema';
import { CreateQuizDto } from 'src/modules/quizzes/dto/create-quiz.dto';

export class CreateLectureDto {
  @IsMongoId()
  @IsExists(Course)
  @IsNotEmpty()
  course: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ContentType)
  @IsNotEmpty()
  contentType: ContentType;

  @IsString()
  @IsOptional()
  contentUrl?: string;

  @IsArray()
  @IsOptional()
  fileUrls?: string[];

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;

  @Type(() => CreateQuizDto)
  @IsOptional()
  quiz?: CreateQuizDto;
}
