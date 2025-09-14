import { ContentType } from "@/schemas/lecture.schema";

export type Lecture = {
  _id: string;
  course: string;
  title: string;
  description: string;
  contentType: ContentType;
  contentUrl: string;
  orderIndex: number;
};
