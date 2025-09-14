import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Quiz } from 'src/modules/quizzes/schemas/quiz.schema';

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  TEXT = 'TEXT',
}

@Schema({ timestamps: true })
export class Question {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  })
  quiz: Quiz;

  @Prop({ required: true })
  content: string;

  @Prop()
  audioUrl: string;

  @Prop({
    type: String,
    enum: QuestionType,
    required: true,
  })
  questionType: QuestionType;

  @Prop({ required: true })
  orderIndex: number;

  @Prop()
  correctAnswer: string; // dung cho trả lời dạng text
}

export type QuestionDocument = HydratedDocument<Question>;
export const QuestionSchema = SchemaFactory.createForClass(Question);
