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
const iview_schema_1 = require("../models/iview.schema");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
// .env dosyasını yükle
dotenv_1.default.config();
const BASE_URL = process.env.BASE_URL;
class InterviewRepository {
    create(interviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            const interviewLink = (0, uuid_1.v4)(); // UUID ile benzersiz link oluşturuluyor
            interviewData.link = `${BASE_URL}/interview/${interviewLink}`; // Benzersiz link ekleniyor
            const interview = new iview_schema_1.Interview(interviewData);
            return yield interview.save();
        });
    }
    getAllInterviews() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield iview_schema_1.Interview.find(); // Tüm mülakatları veritabanından çeker
        });
    }
    findByLink(link) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield iview_schema_1.Interview.findOne({ link });
        });
    }
    findByUUID(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Repository layer UUID:", uuid);
            // UUID'nin link içinde yer aldığından emin olmak için regex kullanıyoruz
            return yield iview_schema_1.Interview.findOne({ link: new RegExp(uuid) });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield iview_schema_1.Interview.find().populate("candidates");
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield iview_schema_1.Interview.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield iview_schema_1.Interview.findByIdAndDelete(id);
        });
    }
    getInterviewById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Interview'ı bul ve soruların text ve duration alanlarını getir
            return yield iview_schema_1.Interview.findById(id).populate('questions', 'questionText duration');
        });
    }
}
exports.default = InterviewRepository;
