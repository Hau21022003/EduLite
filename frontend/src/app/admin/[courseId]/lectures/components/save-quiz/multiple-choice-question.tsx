import { cn } from "@/lib/utils";
import {
  CreateLectureInput,
  CreateQuestionInput,
} from "@/schemas/lecture.schema";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check, Plus } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface MultipleChoiceQuestionProps {
  questionIndex: number;
  question: CreateQuestionInput;
  form: UseFormReturn<CreateLectureInput>;
}

export default function MultipleChoiceQuestion({
  form,
  question,
  questionIndex,
}: MultipleChoiceQuestionProps) {
  const addOption = () => {
    const options =
      form.getValues(`quiz.questions.${questionIndex}.options`) || [];
    form.setValue(`quiz.questions.${questionIndex}.options`, [
      ...options,
      "Answer content",
    ]);
  };

  const setOptionAnswerValue = (optionIdx: number, value: string) => {
    form.setValue(
      `quiz.questions.${questionIndex}.options.${optionIdx}`,
      value
    );
  };

  const removeOption = (optionIdx: number) => {
    const options =
      form.getValues(`quiz.questions.${questionIndex}.options`) || [];
    const updated = options.filter((_, idx) => idx !== optionIdx);
    form.setValue(`quiz.questions.${questionIndex}.options`, updated);
  };

  const updateCorrectAnswers = (
    correctAnswerIndex: number,
    mode: "add" | "delete"
  ) => {
    const correctAnswers =
      form.getValues(`quiz.questions.${questionIndex}.correctAnswers`) || [];
    const updated =
      mode === "add"
        ? [...correctAnswers, correctAnswerIndex]
        : correctAnswers.filter(
            (correctAnswer) => correctAnswer !== correctAnswerIndex
          );
    form.setValue(`quiz.questions.${questionIndex}.correctAnswers`, updated);
  };

  return (
    <div className="space-y-4">
      {question.options?.map((option, optionIdx) => {
        const isCorrectAnswer =
          (question.correctAnswers || []).findIndex(
            (item) => item === optionIdx
          ) !== -1;
        return (
          <div key={optionIdx} className="flex items-center gap-2 ">
            <div
              onClick={() => {
                if (isCorrectAnswer) updateCorrectAnswers(optionIdx, "delete");
                else updateCorrectAnswers(optionIdx, "add");
              }}
              className={cn(
                isCorrectAnswer
                  ? "bg-black text-white"
                  : "border border-gray-300",
                "w-6 h-6 rounded-sm flex items-center justify-center"
              )}
            >
              {isCorrectAnswer && <Check className="w-5 h-5" />}
            </div>
            <div className="ml-1 flex-1 py-2 px-3 rounded-md bg-gray-100">
              <input
                value={option}
                onChange={(e) =>
                  setOptionAnswerValue(optionIdx, e.target.value)
                }
                type="text"
                className="w-full outline-none"
              />
            </div>
            <div
              onClick={() => removeOption(optionIdx)}
              className="p-1 cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                size="lg"
                className="w-7 h-7 text-red-600"
              />
            </div>
          </div>
        );
      })}
      <div
        onClick={addOption}
        className="w-fit cursor-pointer flex items-center gap-1 px-3 h-10 border rounded-md bg-black text-white"
      >
        <Plus className="w-4 h-4" />
        <p className="leading-none inline text-sm font-medium">Add answers</p>
      </div>
    </div>
  );
}
