import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from 'src/modules/course/schemas/course.schema';

export enum ContentType {
  VIDEO = 'VIDEO',
  FILE = 'FILE',
  QUIZ = 'QUIZ',
}

@Schema({ timestamps: true })
export class Lecture {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course: Course;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: ContentType,
    required: true,
  })
  contentType: ContentType;

  @Prop()
  contentUrl?: string;

  @Prop()
  fileUrls?: string[];

  @Prop({ required: true, default: 0 })
  orderIndex: number;
}

export type LectureDocument = HydratedDocument<Lecture>;
export const LectureSchema = SchemaFactory.createForClass(Lecture);
