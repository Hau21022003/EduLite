import { cn } from "@/lib/utils";
import {
  CreateLectureInput,
  CreateQuestionInput,
} from "@/schemas/lecture.schema";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface TrueFalseQuestionProps {
  questionIndex: number;
  question: CreateQuestionInput;
  form: UseFormReturn<CreateLectureInput>;
}

export default function TrueFalseQuestion({
  form,
  questionIndex,
  question,
}: TrueFalseQuestionProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        onClick={() =>
          form.setValue(`quiz.questions.${questionIndex}.correctAnswer`, 1)
        }
        className={cn(
          question.correctAnswer === 1
            ? "border-indigo-500 bg-indigo-50"
            : "bg-gray-100 border-gray-300",
          "cursor-pointer flex-1 rounded-md border p-2 flex items-center gap-3"
        )}
      >
        <p className="rounded-sm bg-white text-indigo-500 font-bold w-7 h-7 leading-none flex items-center justify-center">
          T
        </p>
        <p className="leading-none font-medium">True</p>
      </div>
      <div
        onClick={() =>
          form.setValue(`quiz.questions.${questionIndex}.correctAnswer`, 0)
        }
        className={cn(
          question.correctAnswer === 0
            ? "border-indigo-500 bg-indigo-50"
            : "bg-gray-100 border-gray-300",
          "cursor-pointer flex-1 rounded-md border p-2 flex items-center gap-3"
        )}
      >
        <p className="rounded-sm bg-white text-indigo-500 font-bold w-7 h-7 leading-none flex items-center justify-center">
          F
        </p>
        <p className="leading-none font-medium">False</p>
      </div>
    </div>
  );
}
