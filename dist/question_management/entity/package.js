"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionPackageRelation = void 0;
const mongoose_1 = require("mongoose");
const QuestionPackageRelationSchema = new mongoose_1.Schema({
    questionText: { type: String, required: true },
    packageName: { type: String, required: true },
});
exports.QuestionPackageRelation = (0, mongoose_1.model)('QuestionPackageRelation', QuestionPackageRelationSchema);
