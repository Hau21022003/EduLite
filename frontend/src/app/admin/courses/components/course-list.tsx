import { courseApiRequest } from "@/api-requests/course";
import { useCourseDialogStore } from "@/app/admin/courses/store/use-course-dialog-store";
import { handleErrorApi } from "@/lib/error";
/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { Course } from "@/types/course.type";
import { formatDateWithRelative } from "@/utils/time";
import {
  faClapperboard,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check, Clock } from "lucide-react";
import Link from "next/link";
import React, { Fragment } from "react";

export default function CourseList({
  courses,
  resetCourses,
}: {
  courses: Course[];
  resetCourses: () => void;
}) {
  const { handleOpenCourseDialog } = useCourseDialogStore();
  const deleteCourse = async (courseId: string) => {
    try {
      await courseApiRequest.remove(courseId);
      resetCourses();
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <Fragment>
      {courses.map((course) => (
        <div
          key={course._id}
          className={cn(
            "bg-white p-4 rounded-lg",
            "flex flex-col md:flex-row gap-4",
            ""
          )}
        >
          <img
            src={course.thumbnailUrl}
            alt=""
            className="w-full aspect-square md:w-30 md:h-30 object-cover shrink-0"
          />
          <div className="flex-1 flex flex-col gap-4 md:justify-between md:flex-row">
            <div className="flex-1 space-y-2">
              <p className="line-clamp-1 text-xl">{course.title}</p>
              <p className="text-gray-400">
                {formatDateWithRelative(course.createdAt)}
              </p>
              <div
                className={cn(
                  "w-fit flex items-center gap-2 rounded-lg px-3 py-2 leading-none",
                  course.isPublished
                    ? "bg-green-100 text-green-500"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                {course.isPublished ? (
                  <Fragment>
                    <Check className="w-4 h-4" />
                    <p className="text-sm leading-none">Publish</p>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Clock className="w-4 h-4" />
                    <p className="text-sm leading-none">Draft</p>
                  </Fragment>
                )}
              </div>
            </div>
            <div className="shrink-0 flex gap-4 items-start">
              <Link
                href={`/admin/${course._id}/lectures`}
                title="Lessons"
                className="cursor-pointer font-medium w-10 h-10 flex items-center justify-center leading-none bg-yellow-400 rounded-md"
              >
                <FontAwesomeIcon
                  icon={faClapperboard}
                  size="lg"
                  className="w-7 h-7"
                />
              </Link>
              <button
                title="Edit"
                onClick={() => handleOpenCourseDialog(course._id)}
                className="cursor-pointer font-medium w-10 h-10 flex items-center justify-center leading-none bg-indigo-500 text-white rounded-md"
              >
                <FontAwesomeIcon icon={faPen} size="lg" className="w-7 h-7" />
              </button>
              <button
                title="Delete"
                onClick={() => deleteCourse(course._id)}
                className="cursor-pointer font-medium w-10 h-10 flex items-center justify-center leading-none bg-black text-white rounded-md"
              >
                <FontAwesomeIcon icon={faTrash} size="lg" className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
}
