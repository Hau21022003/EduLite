import { lectureApiRequest } from "@/api-requests/lecture";
import { handleErrorApi } from "@/lib/error";
import { Lecture } from "@/types/lecture.type";
import { useEffect, useState } from "react";

export function useLectureList(courseId: string) {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const fetchLectures = async () => {
    try {
      const lectures = (await lectureApiRequest.findByCourse(courseId)).payload;
      setLectures(lectures);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);
  return { lectures, fetchLectures };
}
