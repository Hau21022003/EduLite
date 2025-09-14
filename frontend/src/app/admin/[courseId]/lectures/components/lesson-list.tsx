"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { lectureApiRequest } from "@/api-requests/lecture";
import { useSaveLectureStore } from "@/app/admin/[courseId]/lectures/stores/save-lecture-store";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { ContentType } from "@/schemas/lecture.schema";
import { Lecture } from "@/types/lecture.type";
import {
  ArrowDown,
  ArrowUp,
  EllipsisVertical,
  Lightbulb,
  Paperclip,
  TvMinimalPlay,
} from "lucide-react";
import React, { Fragment } from "react";

export default function LessonList({
  lectures,
  fetchLectures,
}: {
  lectures: Lecture[];
  fetchLectures: () => void;
}) {
  const { handleOpenSaveLesson } = useSaveLectureStore();
  const { selectedLessonId } = useSaveLectureStore();
  type SwapMode = "up" | "down";
  const swapOrder = async (swapIndex: number, mode: SwapMode) => {
    if (mode === "up" && swapIndex === 0) return;
    if (mode == "down" && swapIndex === lectures.length - 1) return;
    let newIndex: number;
    if (mode === "up") {
      newIndex = swapIndex - 1;
    } else {
      newIndex = swapIndex + 1;
    }
    const lecture1 = lectures[swapIndex];
    const lecture2 = lectures[newIndex];
    try {
      await lectureApiRequest.swapOrder(lecture1._id, lecture2._id);
      fetchLectures();
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <div className="space-y-2">
      {lectures.map((lecture, idx) => (
        <Fragment key={lecture._id}>
          <div
            onClick={() => handleOpenSaveLesson(lecture._id)}
            className={cn(
              "cursor-pointer px-1 h-10 flex items-center gap-4",
              selectedLessonId === lecture._id ? "text-indigo-500" : ""
            )}
          >
            {lecture.contentType === ContentType.VIDEO && (
              <TvMinimalPlay className="w-7 h-7 shrink-0" />
            )}
            {lecture.contentType === ContentType.FILE && (
              <Paperclip className="w-7 h-7 shrink-0" />
            )}
            {lecture.contentType === ContentType.QUIZ && (
              <Lightbulb className="w-7 h-7 shrink-0" />
            )}
            <p className="leading-none line-clamp-1 flex-1">{lecture.title}</p>
            <Popover>
              <PopoverTrigger
                onClick={(e) => e.stopPropagation()}
                className="lg:block hidden"
              >
                <EllipsisVertical className="w-5 h-5 cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="w-40 p-0">
                <div className="flex flex-col">
                  <button
                    onClick={(e) => {
                      swapOrder(idx, "up");
                      e.stopPropagation();
                    }}
                    className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowUp className="w-5 h-5" />
                    <span className="leading-none inline">Move Up</span>
                  </button>
                  <div className="border-t border-gray-300"></div>
                  <button
                    onClick={(e) => {
                      swapOrder(idx, "down");
                      e.stopPropagation();
                    }}
                    className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowDown className="w-5 h-5" />
                    <span className="leading-none inline">Move Down</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            <div
              className="lg:hidden shrink-0 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  swapOrder(idx, "up");
                }}
                className="p-2 cursor-pointer border border-gray-300 rounded-md"
              >
                <ArrowUp className="w-5 h-5" />
                {/* <span className="leading-none inline">Move Up</span> */}
              </button>
              <button
                onClick={() => {
                  swapOrder(idx, "down");
                }}
                className="p-2 cursor-pointer border border-gray-300 rounded-md"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>
          {idx !== lectures.length - 1 && (
            <div className="border-t border-gray-300"></div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
