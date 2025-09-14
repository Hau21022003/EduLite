"use client";
import LessonList from "@/app/admin/[courseId]/lectures/components/lesson-list";
import ResponsiveSaveLecture from "@/app/admin/[courseId]/lectures/components/responsive-save-lecture";
import { useCourseDetails } from "@/app/admin/[courseId]/lectures/hooks/use-course-detail";
import { useLectureList } from "@/app/admin/[courseId]/lectures/hooks/use-lecture-list";
import { useSaveLectureStore } from "@/app/admin/[courseId]/lectures/stores/save-lecture-store";
import { useParams } from "next/navigation";
import React from "react";

export default function LessonsPage() {
  const params = useParams<{ courseId: string }>();
  const { course } = useCourseDetails(params.courseId);
  const { lectures, fetchLectures } = useLectureList(params.courseId);
  const { handleOpenSaveLesson } = useSaveLectureStore();
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        <div className="flex gap-4 text-xl p-4 rounded-xl bg-white">
          <p className="shrink-0 text-gray-500">Course: </p>
          <p className="line-clamp-1 flex-1 font-medium">{course?.title}</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-1 lg:flex-none lg:w-100 bg-white rounded-xl p-4 space-y-2">
            <LessonList lectures={lectures} fetchLectures={fetchLectures} />
            <button
              onClick={() => handleOpenSaveLesson()}
              className="cursor-pointer leading-none w-full text-center py-3 bg-indigo-400 rounded-md font-medium text-white"
            >
              Add New Lecture
            </button>
          </div>
          <ResponsiveSaveLecture fetchLectures={fetchLectures} />
        </div>
      </div>
    </div>
  );
}
