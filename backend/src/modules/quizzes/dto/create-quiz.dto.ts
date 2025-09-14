import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsExists } from 'src/common/validators/is-exist-constraint.validator';
import { Lecture } from 'src/modules/lectures/schemas/lecture.schema';
import { QuestionType } from 'src/modules/quizzes/schemas/question.schema';

export class CreateAnswerDto {
  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean = false;
}

export class CreateQuestionDto {
  @IsMongoId()
  quiz: string; // liên kết với Quiz

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsNumber()
  orderIndex: number;

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}

export class CreateQuizDto {
  @IsMongoId()
  @IsExists(Lecture)
  lecture: string;

  @IsOptional()
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @IsNumber()
  attemptsAllowed?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
