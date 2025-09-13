import z from "zod";

export const CourseBodySchema = z.object({
  title: z
    .string("Title is required.")
    .min(1, { message: "Title is required." }),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
  thumbnailUrl: z
    .string("Thumbnail URL is required.")
    .min(1, { message: "Thumbnail URL is required." }),
});
export type CourseBody = z.TypeOf<typeof CourseBodySchema>;
