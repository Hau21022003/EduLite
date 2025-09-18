"use client";
import {
  ContentType,
  CreateLectureInput,
  CreateQuestionInput,
  QuestionType,
} from "@/schemas/lecture.schema";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import HeaderQuestion from "@/app/admin/[courseId]/lectures/components/save-quiz/header-question";
import TrueFalseQuestion from "@/app/admin/[courseId]/lectures/components/save-quiz/true-false-question";
import SingleChoiceQuestion from "@/app/admin/[courseId]/lectures/components/save-quiz/single-choice-question";
import MultipleChoiceQuestion from "@/app/admin/[courseId]/lectures/components/save-quiz/multiple-choice-question";
import FillInBlankQuestion from "@/app/admin/[courseId]/lectures/components/save-quiz/fill-in-blank-question";

interface SaveQuizProps {
  form: UseFormReturn<CreateLectureInput>;
}

export default function SaveQuiz({ form }: SaveQuizProps) {
  const addQuestion = () => {
    const newQuestion: CreateQuestionInput = {
      content: "",
      questionType: QuestionType.SINGLE_CHOICE,
    };
    const questions = form.getValues("quiz.questions") || [];
    form.setValue("quiz.questions", [...questions, newQuestion]);
  };

  useEffect(() => {
    if (form.watch("contentType") === ContentType.QUIZ && !form.watch("quiz")) {
      addQuestion();
    }
  }, [form.watch("contentType")]);

  return (
    <div className="space-y-4">
      {form.watch("quiz.questions")?.map((question, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-gray-300 overflow-hidden"
        >
          <HeaderQuestion form={form} question={question} questionIndex={idx} />
          <div className="p-4 space-y-4">
            {question.questionType !== QuestionType.FILL_IN_BLANK && (
              <FormField
                control={form.control}
                name={`quiz.questions.${idx}.content`}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Content</FormLabel>
                    <Input
                      className="bg-white"
                      placeholder="Enter question content"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {question.questionType === QuestionType.TRUE_FALSE && (
              <TrueFalseQuestion
                form={form}
                question={question}
                questionIndex={idx}
              />
            )}
            {question.questionType === QuestionType.SINGLE_CHOICE && (
              <SingleChoiceQuestion
                form={form}
                question={question}
                questionIndex={idx}
              />
            )}
            {question.questionType === QuestionType.MULTIPLE_CHOICE && (
              <MultipleChoiceQuestion
                form={form}
                question={question}
                questionIndex={idx}
              />
            )}
            {question.questionType === QuestionType.FILL_IN_BLANK && (
              <FillInBlankQuestion
                form={form}
                question={question}
                questionIndex={idx}
              />
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="px-4 py-2 text-indigo-500 flex gap-2 items-center cursor-pointer font-medium text-sm w-fit rounded-md leading-none border-2 border-gray-300"
      >
        <Plus className="w-5 h-5" />
        <p className="leading-none">Add New Question</p>
      </button>
    </div>
  );
}
