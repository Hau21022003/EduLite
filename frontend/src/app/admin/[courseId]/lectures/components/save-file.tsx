"use client";
import { useUploadFile } from "@/hooks/use-upload-file";
import { CreateLectureInput } from "@/schemas/lecture.schema";
import {
  faCloud,
  faFileAlt,
  faFileExcel,
  faFilePdf,
  faFilePowerpoint,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface SaveFileProps {
  form: UseFormReturn<CreateLectureInput>;
}
export default function SaveFile({ form }: SaveFileProps) {
  const { fileInputRef, handleFileChange, openFileDialog, isLoading } =
    useUploadFile();

  const getFileIcon = (fileUrl: string) => {
    const ext = fileUrl.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "doc":
      case "docx":
        return faFileWord;
      case "xls":
      case "xlsx":
        return faFileExcel;
      case "ppt":
      case "pptx":
        return faFilePowerpoint;
      case "pdf":
        return faFilePdf;
      default:
        return faFileAlt; // fallback
    }
  };
  return (
    <div className="space-y-4">
      <div className="border-2  border-dashed border-gray-300 rounded-lg h-48 w-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <FontAwesomeIcon
            icon={faCloud}
            className="text-indigo-200 w-10 h-10"
            size="4x"
          />
          <p className="text-gray-500">Drag or drop files to upload</p>
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
            accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
            onChange={(e) => {
              const urlPromise = handleFileChange(e);
              urlPromise.then((url) => {
                if (url) {
                  form.setValue("fileUrls", [
                    ...(form.watch("fileUrls") || []),
                    url,
                  ]);
                }
              });
            }}
            hidden
          />
        </div>
      </div>
      {form.watch("fileUrls")?.map((fileUrl, idx) => (
        <div
          key={idx}
          className="grid grid-cols-[60px_1fr_30px] items-center bg-gray-100 rounded-lg p-2 px-3"
        >
          <div className="w-fit p-2 shrink-0 rounded-lg bg-indigo-200 ">
            <FontAwesomeIcon
              className="w-8 h-8"
              size="lg"
              icon={getFileIcon(fileUrl)}
            />
          </div>
          <Link
            href={fileUrl}
            className="flex-1 min-w-0 truncate underline underline-offset-2"
          >
            {fileUrl.split("\\").pop()}
          </Link>
          <button
            type="button"
            onClick={() => {
              const fileUrls = form.watch("fileUrls") || [];
              const filteredFileUrls = fileUrls.filter(
                (url) => url !== fileUrl
              );
              form.setValue("fileUrls", filteredFileUrls);
            }}
            className="cursor-pointer"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
      ))}
    </div>
  );
}
