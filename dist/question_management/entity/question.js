"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = require("mongoose");
const QuestionSchema = new mongoose_1.Schema({
    questionText: { type: String, required: true },
    duration: { type: Number, required: true },
    tags: [{ type: String }],
});
exports.Question = (0, mongoose_1.model)("Question", QuestionSchema);
