import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Question } from 'src/modules/quizzes/schemas/question.schema';

@Schema({ timestamps: true })
export class Answer {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  })
  question: Question;

  @Prop({ required: true })
  content: string; // Noi dung dap an

  @Prop({ required: true, default: false })
  isCorrect: boolean;
}

export type AnswerDocument = HydratedDocument<Answer>;
export const AnswerSchema = SchemaFactory.createForClass(Answer);
