import http from "@/lib/http";
import { CreateLectureInput } from "@/schemas/lecture.schema";
import { Lecture } from "@/types/lecture.type";

const BASE_URL = "/lectures";
export const lectureApiRequest = {
  create: (body: CreateLectureInput) => http.post<Lecture>(`${BASE_URL}`, body),
  update: (id: string, body: CreateLectureInput) =>
    http.put<Lecture>(`${BASE_URL}/${id}`, body),
  findByCourse: (courseId: string) =>
    http.get<Lecture[]>(`${BASE_URL}/course/${courseId}`),
  findOne: (lectureId: string) => http.get<Lecture>(`${BASE_URL}/${lectureId}`),
  remove: (lectureId: string) =>
    http.delete<Lecture>(`${BASE_URL}/${lectureId}`),
  swapOrder: (lectureId1: string, lectureId2: string) =>
    http.put(`${BASE_URL}/swap/${lectureId1}/${lectureId2}`),
};
