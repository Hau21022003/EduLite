import { courseApiRequest } from "@/api-requests/course";
import { handleErrorApi } from "@/lib/error";
import { Course } from "@/types/course.type";
import { useEffect, useState } from "react";

export function useCourseDetails(courseId: string) {
  const [course, setCourse] = useState<Course>();
  useEffect(() => {
    const load = async () => {
      try {
        const course = (await courseApiRequest.findOne(courseId)).payload;
        setCourse(course);
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    load();
  }, [courseId]);
  return { course };
}
