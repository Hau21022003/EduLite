import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Lecture } from 'src/modules/lectures/schemas/lecture.schema';

@Schema({ timestamps: true })
export class Quiz {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true,
    unique: true,
  })
  lecture: Lecture;

  @Prop()
  timeLimit?: number;

  @Prop()
  attemptsAllowed?: number;
}

export type QuizDocument = HydratedDocument<Quiz>;
export const QuizSchema = SchemaFactory.createForClass(Quiz);

QuizSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'quiz',
});

QuizSchema.set('toObject', { virtuals: true });
QuizSchema.set('toJSON', { virtuals: true });
