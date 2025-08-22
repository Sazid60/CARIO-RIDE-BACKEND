import z from "zod";

export const createFaqZodSchema = z.object({
    question: z.string({
        required_error: "Question is required",
    }).min(5, "Question must be at least 5 characters long"),
    email: z
        .string({
            required_error: "Email is required",
        }),
    questionDetails: z.string({
        required_error: "Question details are required",
    }).min(10, "Question details must be at least 10 characters long"),

    answer: z.string().min(5, "Answer must be at least 5 characters long").optional(),
});

export const updateFaqZodSchema = z.object({
    answer: z.string().min(5).optional(),
});
