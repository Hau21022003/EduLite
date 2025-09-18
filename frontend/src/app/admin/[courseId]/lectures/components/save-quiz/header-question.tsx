import {
  CreateLectureInput,
  CreateQuestionInput,
  QuestionType,
} from "@/schemas/lecture.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  faCircleHalfStroke,
  faPen,
  faQuestion,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleDot } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  EllipsisVertical,
  X,
} from "lucide-react";
import React, { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface HeaderQuestionProps {
  questionIndex: number;
  question: CreateQuestionInput;
  form: UseFormReturn<CreateLectureInput>;
}
export default function HeaderQuestion({
  form,
  question,
  questionIndex,
}: HeaderQuestionProps) {
  const swapQuestion = (idx: number, mode: "up" | "down") => {
    const questions = form.getValues("quiz.questions") || [];

    if (questions.length <= 1) return;

    const newIndex = mode === "up" ? idx - 1 : idx + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const updated = [...questions];
    const temp = updated[idx];
    updated[idx] = updated[newIndex];
    updated[newIndex] = temp;

    // Cập nhật vào react-hook-form
    form.setValue("quiz.questions", updated);
  };
  const removeQuestion = (idx: number) => {
    const current = form.getValues("quiz.questions") || [];
    const updated = current.filter((_, i) => i !== idx);
    form.setValue("quiz.questions", updated);
  };
  return (
    <div className="flex justify-between px-4 py-3 bg-gray-50 border-b border-gray-300">
      {/* Left header */}
      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center bg-black rounded-sm text-white">
            <FontAwesomeIcon icon={faQuestion} size="xs" className="w-3 h-3" />
          </div>
          <p className="min-w-6 sm:min-w-20 text-sm font-medium flex gap-1 leading-none">
            <span className="sm:block hidden">Question</span>{" "}
            {questionIndex + 1}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="bg-white flex items-center gap-2 p-2 rounded-md border border-gray-300">
                {question.questionType === QuestionType.SINGLE_CHOICE && (
                  <Fragment>
                    <FontAwesomeIcon
                      icon={faCircleDot}
                      className="w-5 h-5"
                      size="sm"
                    />
                    <p className="truncate inline leading-none text-sm">
                      Single Choice
                    </p>
                  </Fragment>
                )}
                {question.questionType === QuestionType.MULTIPLE_CHOICE && (
                  <Fragment>
                    <FontAwesomeIcon
                      icon={faSquareCheck}
                      className="w-5 h-5"
                      size="sm"
                    />
                    <p className="truncate inline leading-none text-sm">
                      Multiple Choice
                    </p>
                  </Fragment>
                )}
                {question.questionType === QuestionType.TRUE_FALSE && (
                  <Fragment>
                    <FontAwesomeIcon
                      icon={faCircleHalfStroke}
                      className="w-5 h-5"
                      size="sm"
                    />
                    <p className="truncate inline leading-none text-sm">
                      True/False
                    </p>
                  </Fragment>
                )}
                {question.questionType === QuestionType.FILL_IN_BLANK && (
                  <Fragment>
                    <FontAwesomeIcon
                      icon={faPen}
                      className="w-5 h-5"
                      size="sm"
                    />
                    <p className="truncate inline leading-none text-sm">
                      Fill in blank
                    </p>
                  </Fragment>
                )}
                <ChevronDown className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
              {Object.entries(QuestionType).map(([key, label]) => (
                <DropdownMenuItem
                  key={label}
                  className={cn(
                    label === question.questionType ? "bg-indigo-100" : "",
                    "flex items-center gap-2 p-3 rounded-none"
                  )}
                  onClick={() => {
                    setTimeout(() => {
                      form.setValue(
                        `quiz.questions.${questionIndex}.questionType`,
                        label
                      );
                    }, 0);
                  }}
                >
                  {label === QuestionType.SINGLE_CHOICE && (
                    <Fragment>
                      <FontAwesomeIcon
                        icon={faCircleDot}
                        className="w-5 h-5"
                        size="lg"
                      />
                      <p className="leading-none text-sm">Single Choice</p>
                    </Fragment>
                  )}
                  {label === QuestionType.MULTIPLE_CHOICE && (
                    <Fragment>
                      <FontAwesomeIcon
                        icon={faSquareCheck}
                        className="w-5 h-5"
                        size="lg"
                      />
                      <p className="leading-none text-sm">Multiple Choice</p>
                    </Fragment>
                  )}
                  {label === QuestionType.TRUE_FALSE && (
                    <Fragment>
                      <FontAwesomeIcon
                        icon={faCircleHalfStroke}
                        className="w-5 h-5"
                        size="lg"
                      />
                      <p className="leading-none text-sm">True/False</p>
                    </Fragment>
                  )}
                  {label === QuestionType.FILL_IN_BLANK && (
                    <Fragment>
                      <FontAwesomeIcon
                        icon={faPen}
                        className="w-5 h-5"
                        size="lg"
                      />
                      <p className="leading-none text-sm">Fill in blank</p>
                    </Fragment>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Right header */}
      <div className="hidden sm:flex items-center gap-2">
        <div
          onClick={() => swapQuestion(questionIndex, "up")}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white border-gray-300 border cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </div>
        <div
          onClick={() => swapQuestion(questionIndex, "down")}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white border-gray-300 border cursor-pointer"
        >
          <ArrowDown className="w-5 h-5" />
        </div>
        <div className="border-l-2 bg-gray-500 h-8"></div>
        <div
          onClick={() => removeQuestion(questionIndex)}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-black text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="sm:hidden">
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-white border-gray-300 border cursor-pointer">
            <EllipsisVertical className="w-5 h-5" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          <DropdownMenuItem
            className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setTimeout(() => {
                swapQuestion(questionIndex, "up");
              }, 0);
            }}
          >
            <ArrowUp className="w-5 h-5" />
            <span className="leading-none inline">Move Up</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setTimeout(() => {
                swapQuestion(questionIndex, "down");
              }, 0);
            }}
          >
            <ArrowDown className="w-5 h-5" />
            <span className="leading-none inline">Move Down</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setTimeout(() => {
                removeQuestion(questionIndex);
              }, 0);
            }}
          >
            <X className="w-5 h-5" />
            <span className="leading-none inline">Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
