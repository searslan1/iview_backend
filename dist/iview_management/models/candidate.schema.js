"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candidate = exports.CandidateSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.CandidateSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    kvkkApproval: { type: Boolean, required: true },
    videoUrl: { type: String },
    status: { type: String, default: "pending" }, // initial status is pending
    note: { type: String, default: "" }, // Başlangıçta boş olacak
    interview: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Interview" } // Adayın hangi mülakata katıldığı
});
exports.Candidate = mongoose_1.default.model("Candidate", exports.CandidateSchema);
