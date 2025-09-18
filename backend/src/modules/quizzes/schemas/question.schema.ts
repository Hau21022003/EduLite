import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Quiz } from 'src/modules/quizzes/schemas/quiz.schema';

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
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

  @Prop({ type: [String], default: [] })
  options?: string[]; // Chỉ dùng cho single/multi

  @Prop({ type: Number })
  correctAnswer?: number; // single_choice, true_false

  @Prop({ type: [Number] })
  correctAnswers?: number[]; // multiple_choice

  @Prop({
    type: [
      {
        position: { type: Number },
        accepted: { type: String },
      },
    ],
    default: [],
  })
  answers?: { position: number; accepted: string }[]; // fill_in_blank
}

export type QuestionDocument = HydratedDocument<Question>;
export const QuestionSchema = SchemaFactory.createForClass(Question);
