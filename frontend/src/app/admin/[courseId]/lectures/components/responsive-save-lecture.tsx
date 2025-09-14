"use client";
import { lectureApiRequest } from "@/api-requests/lecture";
import SaveLecture from "@/app/admin/[courseId]/lectures/components/save-lecture";
import { useSaveLectureStore } from "@/app/admin/[courseId]/lectures/stores/save-lecture-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleErrorApi } from "@/lib/error";
import { ContentType, CreateLectureSchema } from "@/schemas/lecture.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ResponsiveSaveLecture({
  fetchLectures,
}: {
  fetchLectures: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(CreateLectureSchema),
  });

  const params = useParams<{ courseId: string }>();
  const { selectedLessonId } = useSaveLectureStore();

  useEffect(() => {
    form.reset({ contentType: ContentType.VIDEO, course: params.courseId });
  }, [params]);

  useEffect(() => {
    const fetchLecture = async (lessonId: string) => {
      try {
        const lecture = (await lectureApiRequest.findOne(lessonId)).payload;
        form.reset(lecture);
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    if (selectedLessonId) {
      fetchLecture(selectedLessonId);
    } else {
      form.reset({ contentType: ContentType.VIDEO });
    }
  }, [selectedLessonId]);

  const { open, handleCloseSaveLesson } = useSaveLectureStore();

  const [isLg, setIsLg] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  useEffect(() => {
    const handleResize = () => {
      setIsLg(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isLg ? (
    <div className="flex-1 bg-white rounded-lg p-4 min-w-0">
      <SaveLecture form={form} fetchLectures={fetchLectures} />
    </div>
  ) : (
    <Dialog open={open} onOpenChange={handleCloseSaveLesson}>
      <DialogContent className=" overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="uppercase">Order details</DialogTitle>
        </DialogHeader>
        <SaveLecture form={form} fetchLectures={fetchLectures} />
      </DialogContent>
    </Dialog>
  );
}
