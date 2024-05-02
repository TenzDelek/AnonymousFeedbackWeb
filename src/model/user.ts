import mongoose ,{ Schema,Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt:Date
}

//for type safety
const MessageSchema: Schema<Message>=new Schema(
    {

    }
)