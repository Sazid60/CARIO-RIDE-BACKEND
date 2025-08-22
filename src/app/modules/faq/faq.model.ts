import { Schema, model } from "mongoose";
import { IFaq } from "./faq.interface";

const faqSchema = new Schema<IFaq>(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        questionDetails: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const Faq = model<IFaq>("Faq", faqSchema);
