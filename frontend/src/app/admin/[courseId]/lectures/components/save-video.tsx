/* eslint-disable @next/next/no-img-element */
"use client";
import TextEditor from "@/components/text-editor";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { CreateLectureInput } from "@/schemas/lecture.schema";
import React, { Fragment, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useUploadFile } from "@/hooks/use-upload-file";

interface SaveVideoProps {
  form: UseFormReturn<CreateLectureInput>;
}

export default function SaveVideo({ form }: SaveVideoProps) {
  const { fileInputRef, handleFileChange, openFileDialog, isLoading } =
    useUploadFile();
  return (
    <Fragment>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Description</FormLabel>
            <TextEditor setValue={field.onChange} value={field.value} />
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="border-2  border-dashed border-gray-300 rounded-lg h-48 w-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <FontAwesomeIcon
            icon={faCloud}
            className="text-indigo-200 w-10 h-10"
            size="4x"
          />
          <p className="text-gray-500">Drag or drop video files to upload</p>
          <button
            onClick={openFileDialog}
            disabled={isLoading}
            type="button"
            className=" disabled:cursor-not-allowed cursor-pointer leading-none p-3 border-2 rounded-lg border-gray-300"
          >
            {isLoading ? "Uploading" : "Select File"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => {
              const urlPromise = handleFileChange(e);
              urlPromise.then((url) => {
                if (url) {
                  form.setValue("contentUrl", url);
                }
              });
            }}
            hidden
          />
        </div>
      </div>
      {form.watch("contentUrl") && (
        <div className="grid grid-cols-[160px_1fr] gap-4 border-2 border-gray-300 p-4">
          <video
            src={form.watch("contentUrl")}
            controls
            className="w-40 h-28 object-contain shrink-0 rounded"
          />
          <p className="flex-1 min-w-0 truncate underline underline-offset-2">
            {form.watch("contentUrl")}
          </p>
        </div>
      )}
    </Fragment>
  );
}
