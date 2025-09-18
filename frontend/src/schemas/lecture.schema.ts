import z from "zod";

export enum ContentType {
  VIDEO = "VIDEO",
  FILE = "FILE",
  QUIZ = "QUIZ",
}

export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE",
  FILL_IN_BLANK = "FILL_IN_BLANK",
}

// export const CreateAnswerSchema = z.object({
//   content: z.string().min(1, "Answer content is required"),
//   isCorrect: z.boolean().default(false).optional(),
// });
export const CreateAnswerSchema = z.object({
  position: z.number().default(0).optional(),
  accepted: z.string("Answer content is required"),
});

export const CreateQuestionSchema = z.object({
  content: z.string().min(1, "Question content is required"),
  audioUrl: z.string().optional(),
  questionType: z.enum(QuestionType),
  // orderIndex: z.number(),
  options: z.array(z.string("Option content is required")).optional(), // Chỉ dùng cho single/multi
  correctAnswer: z.number().optional(), // single_choice, true_false
  correctAnswers: z.array(z.number()).optional(), // multiple_choice
  answers: z.array(CreateAnswerSchema).optional(),
});

export const CreateQuizSchema = z.object({
  // lecture: z.string().min(1, "Lecture ID is required"), // MongoId dạng string
  timeLimit: z.number().optional(),
  attemptsAllowed: z.number().optional(),
  questions: z.array(CreateQuestionSchema),
});

export const CreateLectureSchema = z.object({
  course: z.string().min(1, "Course ID is required"), // MongoId dạng string
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  contentType: z.enum(ContentType),
  contentUrl: z.string().optional(),
  fileUrls: z.array(z.string()).optional(),
  orderIndex: z.number().default(0).optional(),
  quiz: CreateQuizSchema.optional(),
});

export type CreateLectureInput = z.infer<typeof CreateLectureSchema>;
export type CreateQuizInput = z.infer<typeof CreateQuizSchema>;
export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;
export type CreateAnswerInput = z.infer<typeof CreateAnswerSchema>;
