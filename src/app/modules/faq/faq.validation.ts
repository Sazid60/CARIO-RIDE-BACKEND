import z from "zod";

export const createFaqZodSchema = z.object({
    email: z
        .string({
            required_error: "Email is required",
        }),
    name: z
        .string({
            required_error: "Name is required",
        }),
    question: z.string({
        required_error: "Question details are required",
    }).min(10, "Question details must be at least 10 characters long"),

    answer: z.string().min(5, "Answer must be at least 5 characters long").optional(),
});

export const updateFaqZodSchema = z.object({
    answer: z.string().min(5).optional(),
});
