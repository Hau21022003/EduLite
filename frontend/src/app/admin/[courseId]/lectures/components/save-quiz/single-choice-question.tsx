import RadioItem from "@/components/ratio-item";
import {
  CreateLectureInput,
  CreateQuestionInput,
} from "@/schemas/lecture.schema";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";
interface SingleChoiceQuestionProps {
  questionIndex: number;
  question: CreateQuestionInput;
  form: UseFormReturn<CreateLectureInput>;
}
export default function SingleChoiceQuestion({
  form,
  question,
  questionIndex,
}: SingleChoiceQuestionProps) {
  const addOption = () => {
    const options =
      form.getValues(`quiz.questions.${questionIndex}.options`) || [];
    form.setValue(`quiz.questions.${questionIndex}.options`, [
      ...options,
      "Answer content",
    ]);
  };

  const changeCorrectAnswer = (correctAnswerIndex: number) => {
    form.setValue(
      `quiz.questions.${questionIndex}.correctAnswer`,
      correctAnswerIndex
    );
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

  return (
    <div className="space-y-4">
      {question.options?.map((option, optionIdx) => (
        <div key={optionIdx} className="flex items-center gap-2 ">
          <RadioItem
            value="false"
            checked={question.correctAnswer === optionIdx}
            onChange={() => changeCorrectAnswer(optionIdx)}
          />
          <div className="ml-1 flex-1 py-2 px-3 rounded-md bg-gray-100">
            <input
              value={option}
              onChange={(e) => setOptionAnswerValue(optionIdx, e.target.value)}
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
      ))}
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
