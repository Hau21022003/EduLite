"use client";
import { useSaveLectureStore } from "@/app/admin/[courseId]/lectures/stores/save-lecture-store";
import { cn } from "@/lib/utils";
import { ContentType } from "@/schemas/lecture.schema";
import { Lecture } from "@/types/lecture.type";
import { Lightbulb, Paperclip, TvMinimalPlay } from "lucide-react";
import React, { Fragment } from "react";

export default function LessonList({ lectures }: { lectures: Lecture[] }) {
  const { handleOpenSaveLesson } = useSaveLectureStore();
  const { selectedLessonId } = useSaveLectureStore();
  return (
    <div className="space-y-2">
      {lectures.map((lecture, idx) => (
        <Fragment key={lecture._id}>
          <div
            onClick={() => handleOpenSaveLesson(lecture._id)}
            className={cn(
              "cursor-pointer px-3 h-10 flex items-center gap-4",
              selectedLessonId === lecture._id ? "text-indigo-500" : ""
            )}
          >
            {lecture.contentType === ContentType.VIDEO && (
              <TvMinimalPlay className="w-7 h-7" />
            )}
            {lecture.contentType === ContentType.FILE && (
              <Paperclip className="w-7 h-7" />
            )}
            {lecture.contentType === ContentType.QUIZ && (
              <Lightbulb className="w-7 h-7" />
            )}
            <p className="leading-none line-clamp-1">{lecture.title}</p>
          </div>
          {idx !== lectures.length - 1 && (
            <div className="border-t border-gray-300"></div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
