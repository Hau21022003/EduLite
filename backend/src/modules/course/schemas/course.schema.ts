import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ required: true })
  thumbnailUrl: string;
}

export type UserDocument = HydratedDocument<Course>;
export const CourseSchema = SchemaFactory.createForClass(Course);
