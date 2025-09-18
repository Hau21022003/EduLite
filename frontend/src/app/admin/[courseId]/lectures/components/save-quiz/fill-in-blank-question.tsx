"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  CreateLectureInput,
  CreateQuestionInput,
} from "@/schemas/lecture.schema";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";
import React, { Fragment, useCallback, useEffect, useRef } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

interface FillInBlankQuestionProps {
  questionIndex: number;
  question: CreateQuestionInput;
  form: UseFormReturn<CreateLectureInput>;
}

export default function FillInBlankQuestion({
  form,
  question,
  questionIndex,
}: FillInBlankQuestionProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const questionContent = useWatch({
    control: form.control,
    name: `quiz.questions.${questionIndex}.content`,
  });

  const content = form.watch(`quiz.questions.${questionIndex}.content`);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerText !== (questionContent || "")
    ) {
      editorRef.current.innerText = questionContent || "";
    }
  }, [questionContent]);

  const handleBlur = () => {
    if (editorRef.current) {
      form.setValue(
        `quiz.questions.${questionIndex}.content`,
        editorRef.current.innerText,
        { shouldDirty: true }
      );
    }
  };

  const syncAnswersWithBlanks = useCallback(() => {
    const blankCount = (questionContent?.match(/____/g) || []).length;
    const currentAnswers =
      form.watch(`quiz.questions.${questionIndex}.answers`) || [];

    if (currentAnswers.length !== blankCount) {
      if (blankCount > currentAnswers.length) {
        // Thêm answers mới
        const newAnswers = [...currentAnswers];
        for (let i = currentAnswers.length; i < blankCount; i++) {
          newAnswers.push({
            position: i + 1,
            accepted: "",
          });
        }
        form.setValue(`quiz.questions.${questionIndex}.answers`, newAnswers);
      } else {
        // Xóa answers thừa
        const trimmedAnswers = currentAnswers.slice(0, blankCount);
        // Cập nhật lại position
        const updatedAnswers = trimmedAnswers.map((answer, index) => ({
          ...answer,
          position: index + 1,
        }));
        form.setValue(
          `quiz.questions.${questionIndex}.answers`,
          updatedAnswers
        );
      }
    }
  }, [form, questionContent, questionIndex]);

  const handleAddBlank = () => {
    const editor = editorRef.current;
    if (!editor) return;

    // Thêm blank tại vị trí cursor hoặc cuối text
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editor.contains(range.commonAncestorContainer)) {
        // Thêm tại vị trí cursor
        const textNode = document.createTextNode("____");
        range.insertNode(textNode);

        // Di chuyển cursor sau blank vừa thêm
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editor.innerText = editor.innerText + "____";
      }
    } else {
      editor.innerText = editor.innerText + "____";
    }
    handleBlur();
  };

  const removeBlank = (blankIndex: number) => {
    const regex = /____/g;
    let match: RegExpExecArray | null;
    let matchIndex = 0;
    let startPos = -1;

    while ((match = regex.exec(questionContent)) !== null) {
      if (matchIndex === blankIndex) {
        startPos = match.index;
        break;
      }
      matchIndex++;
    }

    // Nếu tìm thấy blank cần xóa
    if (startPos !== -1) {
      const currentAnswers =
        form.watch(`quiz.questions.${questionIndex}.answers`) || [];
      const updatedAnswers = currentAnswers.filter(
        (_, answerIndex) => answerIndex !== matchIndex
      );
      form.setValue(`quiz.questions.${questionIndex}.answers`, updatedAnswers);
      const newContent =
        questionContent.slice(0, startPos) +
        questionContent.slice(startPos + 4); // 4 ký tự "____"
      // editorRef.current?.innerText = newContent;

      // Cập nhật vào form
      form.setValue(`quiz.questions.${questionIndex}.content`, newContent, {
        shouldDirty: true,
      });
    }
  };

  useEffect(() => {
    syncAnswersWithBlanks();
  }, [syncAnswersWithBlanks]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={`quiz.questions.${questionIndex}.content`}
        render={() => (
          <FormItem className="space-y-1">
            <FormLabel>Content</FormLabel>
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[80px] border rounded-lg p-2 bg-white min-w-0 flex gap-2 flex-wrap items-start break-all whitespace-pre-wrap"
              // className="min-h-[80px] border rounded-lg p-2 bg-white min-w-0 flex gap-2 flex-wrap items-start break-all whitespace-pre-wrap"
              onBlur={handleBlur}
              suppressContentEditableWarning
            />
            {/* <span className="break-all whitespace-pre-wrap">{content}</span> */}
            {/* </div> */}

            <FormMessage />
          </FormItem>
        )}
      />

      <button
        type="button"
        className="rounded-md h-10 px-4 flex items-center gap-2 border-2  border-dashed"
        onClick={handleAddBlank}
      >
        <Plus className="w-4 h-4" />
        <p className="font-medium text-sm">Add Blank</p>
      </button>

      {content && content.includes("____") && (
        <div className="mt-2">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Answer Options:
          </label>
          <div className="flex items-center gap-3 flex-wrap border rounded-lg p-3 bg-gray-50 min-h-[40px]">
            {content?.split("____")?.map((part, partIdx) => {
              return (
                <Fragment key={`blank-${partIdx}`}>
                  <span className="break-all whitespace-pre-wrap">{part}</span>
                  {partIdx < content.split("____").length - 1 && (
                    <div
                      className={cn(
                        "relative flex items-center gap-1 group",
                        "bg-white border-2 border-gray-300 py-1 px-2 rounded-md"
                      )}
                    >
                      <input
                        value={form.getValues(
                          `quiz.questions.${questionIndex}.answers.${partIdx}.accepted`
                        )}
                        type="text"
                        onChange={(e) =>
                          form.setValue(
                            `quiz.questions.${questionIndex}.answers.${partIdx}.accepted`,
                            e.target.value
                          )
                        }
                        className="w-fit outline-none flex-grow min-w-0"
                      />
                      <div
                        onClick={() => removeBlank(partIdx)}
                        className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          size="sm"
                          className="w-7 h-7 text-gray-500"
                        />
                      </div>
                      <div className="absolute -top-2 -left-2 h-5 w-5 bg-indigo-400 text-white font-medium rounded-full flex items-center justify-center leading-none text-xs shadow">
                        {partIdx + 1 <= 9 ? `${partIdx + 1}` : "9+"}
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
