"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewController = void 0;
const iview_service_1 = __importDefault(require("../service/iview.service"));
const iview_dto_1 = require("../dto/iview.dto");
const uuid_1 = require("uuid");
const question_1 = require("../../question_management/entity/question");
const iview_schema_1 = require("../models/iview.schema");
const dotenv_1 = __importDefault(require("dotenv"));
// .env dosyasını yükle
dotenv_1.default.config();
const BASE_URL = process.env.BASE_URL;
class InterviewController {
    constructor() {
        // Create Interview
        this.createInterview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, packageName, status } = req.body;
                const questions = yield question_1.Question.find({
                    tags: { $regex: new RegExp(packageName, "i") }
                });
                const questionIds = questions.map((q) => q._id.toString());
                const interviewLink = (0, uuid_1.v4)();
                const interviewDTO = new iview_dto_1.CreateInterviewDTO({
                    title,
                    questions: questionIds,
                    status,
                });
                const newInterview = Object.assign(Object.assign({}, interviewDTO), { link: `${BASE_URL}/interview/${interviewLink}` });
                const createdInterview = yield this.interviewService.createInterview(newInterview);
                console.log("Created Interview:", createdInterview);
                res.status(201).json(createdInterview);
            }
            catch (error) {
                res.status(400).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        // Get all interviews with questions
        this.getAllInterviews = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Interview modelini populate ile sorularla birlikte getiriyoruz
                const interviews = yield iview_schema_1.Interview.find().populate('questions', 'questionText duration');
                res.status(200).json(interviews);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        // Get interview by link (UUID extraction from link)
        this.getInterviewByLink = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { interviewId } = req.params; // URL'den gelen interviewId
                if (!interviewId) {
                    res.status(400).json({ error: "Interview ID is missing" });
                    return;
                }
                console.log("Received interviewId:", interviewId);
                // Interview'i bul
                const interview = yield iview_schema_1.Interview.findOne({ _id: interviewId });
                if (!interview) {
                    console.log("Interview not found");
                    res.status(404).json({ message: "Interview not found" });
                    return;
                }
                console.log("Found Interview:", interview);
                // Link içerisinden UUID'yi çıkar (linkin sonundaki UUID kısmı)
                const interviewLink = (_a = interview.link) === null || _a === void 0 ? void 0 : _a.split('/').pop(); // Son kısımdaki UUID'yi alır
                // UUID'yi döndür
                res.status(200).json({
                    uuid: interviewLink, // UUID'yi döndür
                });
            }
            catch (error) {
                console.log("Error fetching interview:", error);
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        this.getInterviewByUUID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { uuid } = req.params;
            console.log("Received UUID:", uuid);
            try {
                const interview = yield iview_schema_1.Interview.findOne({ link: `${BASE_URL}/interview/${uuid}` })
                    .populate('questions', 'questionText duration');
                if (!interview) {
                    console.log("Interview not found");
                    res.status(404).json({ message: "Interview not found" });
                    return;
                }
                const populatedQuestions = interview.questions;
                res.status(200).json({
                    title: interview.title,
                    questions: populatedQuestions.map((question) => ({
                        questionText: question.questionText,
                        duration: question.duration,
                    })),
                });
            }
            catch (error) {
                console.log("Error fetching interview:", error);
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        // Get Interview by ID
        this.getInterviewById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const interview = yield this.interviewService.getInterviewById(req.params.id);
                if (!interview) {
                    res.status(404).json({ message: "Interview not found" });
                    return;
                }
                res.status(200).json(interview);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        // Delete Interview
        this.deleteInterview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedInterview = yield this.interviewService.deleteInterview(req.params.id);
                if (!deletedInterview) {
                    res.status(404).json({ message: "Interview not found" });
                    return;
                }
                res.status(200).json({ message: "Interview deleted successfully", deletedInterview });
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        this.interviewService = new iview_service_1.default();
    }
}
exports.InterviewController = InterviewController;
