"use client";
import { lectureApiRequest } from "@/api-requests/lecture";
import SaveVideo from "@/app/admin/[courseId]/lectures/components/save-video";
import { useSaveLectureStore } from "@/app/admin/[courseId]/lectures/stores/save-lecture-store";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { ContentType, CreateLectureInput } from "@/schemas/lecture.schema";
import { Lightbulb, Loader2, Paperclip, TvMinimalPlay } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export default function SaveLecture({
  form,
  fetchLectures,
}: {
  form: UseFormReturn<CreateLectureInput>;
  fetchLectures: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleCloseSaveLesson, isEdit, selectedLessonId } =
    useSaveLectureStore();
  const checkData = (data: CreateLectureInput) => {
    if (data.contentType === ContentType.VIDEO && !data.contentUrl) {
      throw new Error("Video is required");
    }
    if (data.contentType === ContentType.FILE && !data.contentUrl) {
      throw new Error("File is required");
    }
  };

  const saveLecture = async (data: CreateLectureInput) => {
    try {
      checkData(data);
      setIsLoading(true);
      if (isEdit && selectedLessonId) {
        await lectureApiRequest.update(selectedLessonId, data);
      } else {
        await lectureApiRequest.create(data);
      }
      fetchLectures();
      handleCloseSaveLesson();
      form.reset({ contentType: ContentType.VIDEO });
    } catch (error) {
      handleErrorApi({ error, duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const removeLecture = async () => {
    try {
      fetchLectures();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    form.setValue("contentUrl", undefined);
  }, [form.watch("contentType")]);

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((data) => {
          saveLecture(data);
        })}
      >
        <div className="flex gap-4 flex-wrap">
          {Object.entries(ContentType).map(([key, value]) => (
            <div
              key={key}
              onClick={() => form.setValue("contentType", value as ContentType)}
              className={cn(
                "sm:w-26 p-2 border-2 flex items-center justify-center gap-2 cursor-pointer",
                form.watch("contentType") === value
                  ? "border-indigo-400 text-black"
                  : "border-gray-300 text-gray-400"
              )}
            >
              {value === ContentType.VIDEO && (
                <Fragment>
                  <TvMinimalPlay className="w-5 h-5" />
                  <p className="leading-none font-medium">Video</p>
                </Fragment>
              )}
              {value === ContentType.FILE && (
                <Fragment>
                  <Paperclip className="w-5 h-5" />
                  <p className="leading-none font-medium">File</p>
                </Fragment>
              )}
              {value === ContentType.QUIZ && (
                <Fragment>
                  <Lightbulb className="w-5 h-5" />
                  <p className="leading-none font-medium">Quiz</p>
                </Fragment>
              )}
            </div>
          ))}
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Title</FormLabel>
              <Input
                className="bg-white"
                placeholder="Enter lecture title"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("contentType") === ContentType.VIDEO && (
          <SaveVideo form={form} />
        )}
        <div className="flex gap-4">
          <button
            type="submit"
            className="gap-2 cursor-pointer h-10 px-4 rounded-md bg-indigo-400 text-white flex items-center leading-none"
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            <p>Save Changes</p>
          </button>
          {selectedLessonId && (
            <button
              onClick={() => removeLecture()}
              type="button"
              className="cursor-pointer h-10 px-4 border-2 border-gray-300 rounded-md flex items-center leading-none"
            >
              Remove
            </button>
          )}
        </div>
      </form>
    </Form>
  );
}
