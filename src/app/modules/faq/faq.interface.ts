import { Types } from "mongoose";


export interface IFaq {
    _id?: Types.ObjectId,
    email : string,
    question : string,
    questionDetails : string,
    answer?: string
}
