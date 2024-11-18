import { Schema, model, Document } from "mongoose";

export interface IQuestion extends Document {
  questionText: string;
  duration: number;
  tags: [];
}

const QuestionSchema: Schema = new Schema({
  questionText: { type: String, required: true },
  duration: { type: Number, required: true },
  tags: [{ type: String }],
});

export const Question = model<IQuestion>("Question", QuestionSchema);
