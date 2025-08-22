/* eslint-disable no-console */
import { Faq } from "./faq.model";
import { IFaq } from "./faq.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { sendEmail } from "../../utils/sendEmail";

const askQuestion = async (payload: Partial<IFaq>) => {
    const faq = await Faq.create(payload);
    return faq;
};

const replyQuestion = async (id: string, payload: Partial<IFaq>) => {
    const faq = await Faq.findById(id);

    if (!faq) {
        throw new AppError(httpStatus.NOT_FOUND, "FAQ not found");
    }

    faq.answer = payload.answer;
    await faq.save();

    await sendEmail({
        to: faq.email,
        subject: "Your Question Has Been Answered!",
        templateName: "faqReplay",
        templateData: {
            question: faq.question,
            answer: faq.answer,
        },
        attachments: [],
    });

    return await Faq.findById(id)
};


const getAllFaqs = async () => {
    const faqs = await Faq.find().sort({ _id: -1 });
    return faqs;
};

const getSingleFaq = async (id: string) => {
    const faq = await Faq.findById(id);
    if (!faq) {
        throw new AppError(httpStatus.NOT_FOUND, "FAQ not found");
    }
    return faq;
};

export const faqServices = {
    askQuestion,
    replyQuestion,
    getAllFaqs,
    getSingleFaq,
};
