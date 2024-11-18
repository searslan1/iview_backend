import { Request, Response } from "express";
import InterviewService from "../service/iview.service";
import { CreateInterviewDTO } from "../dto/iview.dto";
import { v4 as uuidv4 } from 'uuid';
import { IQuestion, Question } from "../../question_management/entity/question";
import { Interview } from "../models/iview.schema";
import { ObjectId } from "mongoose";

export class InterviewController {
  private interviewService: InterviewService;

  constructor() {
    this.interviewService = new InterviewService();
  }

  // Create Interview
  public createInterview = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { title, packageName, status } = req.body; // 'status' frontend'den alınacak
  
      // packageName (tags) ile soruları buluyoruz
      const questions = await Question.find({
        tags: { $regex: new RegExp(packageName, "i") }  // Küçük/büyük harf duyarsız arama
      });
  
      // Soruların ID'lerini map'liyoruz ve türünü belirtiyoruz
      const questionIds: string[] = questions.map((q) => (q._id as ObjectId).toString());
  
      // UUID ile benzersiz bir link oluşturuyoruz
      const interviewLink = uuidv4(); // Benzersiz link
  
      // Interview DTO'yu oluşturuyoruz
      const interviewDTO = new CreateInterviewDTO({
        title,
        questions: questionIds,
        status,  // Frontend'den gelen mülakat durumu
      });
  
      // Yeni mülakat nesnesini oluşturuyoruz ve link'i ekliyoruz
      const newInterview = {
        ...interviewDTO,
        link: `http://localhost:5174/interview/${interviewLink}`, // Link oluşturuluyor
      };
  
      // Servis katmanında yeni interview'u kaydediyoruz
      const createdInterview = await this.interviewService.createInterview(newInterview);
  
      console.log("Created Interview:", createdInterview);
  
      res.status(201).json(createdInterview);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
  

  

  // Get all interviews with questions
  public getAllInterviews = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Interview modelini populate ile sorularla birlikte getiriyoruz
      const interviews = await Interview.find().populate('questions', 'questionText duration');
      res.status(200).json(interviews);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // Get interview by link (UUID extraction from link)
  public getInterviewByLink = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { interviewId } = req.params; // URL'den gelen interviewId
      if (!interviewId) {
        res.status(400).json({ error: "Interview ID is missing" });
        return;
      }
  
      console.log("Received interviewId:", interviewId);
  
      // Interview'i bul
      const interview = await Interview.findOne({ _id: interviewId });
  
      if (!interview) {
        console.log("Interview not found");
        res.status(404).json({ message: "Interview not found" });
        return;
      }
  
      console.log("Found Interview:", interview);
  
      // Link içerisinden UUID'yi çıkar (linkin sonundaki UUID kısmı)
      const interviewLink = interview.link?.split('/').pop(); // Son kısımdaki UUID'yi alır
  
      // UUID'yi döndür
      res.status(200).json({
        uuid: interviewLink, // UUID'yi döndür
      });
    } catch (error) {
      console.log("Error fetching interview:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  
  public getInterviewByUUID = async (req: Request, res: Response): Promise<void> => {
    const { uuid } = req.params; // URL'den gelen UUID
    console.log("Received UUID:", uuid);
  
    try {
      // UUID'ye sahip linki buluyoruz
      const interview = await Interview.findOne({ link: `http://localhost:5174/interview/${uuid}` })
        .populate('questions', 'questionText duration'); // Soru metinlerini ve sürelerini alıyoruz
  
      if (!interview) {
        console.log("Interview not found");
        res.status(404).json({ message: "Interview not found" });
        return;
      }
  
      console.log("Found Interview:", interview);
  
      // `questions` alanını IQuestion[] olarak alıyoruz
      const populatedQuestions = interview.questions as unknown as IQuestion[];
  
      // Soruların text ve duration bilgilerini döndürüyoruz
      res.status(200).json({
        title: interview.title,
        questions: populatedQuestions.map((question: IQuestion) => ({
          questionText: question.questionText,
          duration: question.duration,
        })),
      });
    } catch (error) {
      console.log("Error fetching interview:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
  
  
  
  
  
  
  

  
  // Get Interview by ID
  public getInterviewById = async (req: Request, res: Response): Promise<void> => {
    try {
      const interview = await this.interviewService.getInterviewById(req.params.id);

      if (!interview) {
        res.status(404).json({ message: "Interview not found" });
        return;
      }

      res.status(200).json(interview);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // Delete Interview
  public deleteInterview = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const deletedInterview = await this.interviewService.deleteInterview(req.params.id);

      if (!deletedInterview) {
        res.status(404).json({ message: "Interview not found" });
        return;
      }

      res.status(200).json({ message: "Interview deleted successfully", deletedInterview });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
