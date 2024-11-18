import { Request, Response } from "express";
import CandidateService from "../service/candidate.service";
import { CreateCandidateDTO } from "../dto/candidate.dto";
import { Interview } from '../models/iview.schema';


export class CandidateController {
  
  private candidateService: CandidateService;

  constructor() {
    this.candidateService = new CandidateService();
  }

  public createCandidate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { uuid, ...candidateData } = req.body;
  
      // Gelen uuid ve aday verilerini kontrol etmek için
      console.log("Received UUID:", uuid);
      console.log("Received Candidate Data:", candidateData);
  
      const interview = await Interview.findOne({ link: { $regex: uuid } });
      if (!interview) {
        res.status(404).json({ error: "Interview not found" });
        return;
      }
  
      const candidateDTO = new CreateCandidateDTO({ ...candidateData, interview: interview._id });
      const newCandidate = await this.candidateService.createCandidate(candidateDTO);
  
      // Yeni oluşturulan aday verilerini kontrol etmek için
      console.log("Created Candidate:", newCandidate);
  
      res.status(201).json({ candidateId: newCandidate._id, ...newCandidate.toObject() });
    } catch (error) {
      console.error("Error in createCandidate:", error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
  
  
  

    public getCandidateByInterviewId = async (
      req: Request,
      res: Response
    ): Promise<void> => {
      try {
        const { id: interviewId } = req.params;
  
        // Aday bilgilerini ve presigned URL'leri al
        const candidatesWithPresignedUrls = await this.candidateService.getCandidateByInterviewId(interviewId); 
  
        if (candidatesWithPresignedUrls.length === 0) {
          res.status(404).json({ message: "Bu mülakata ait aday bulunamadı." });
          return;
        }
  
        res.status(200).json(candidatesWithPresignedUrls);
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
      }
    };

  public updateCandidate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const updatedCandidate = await this.candidateService.updateCandidate(
        req.params.id,
        req.body
      );
      if (!updatedCandidate) {
        res.status(404).json({ message: "Candidate not found" });
        return;
      }
      res.status(200).json(updatedCandidate);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  public deleteCandidate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const deletedCandidate = await this.candidateService.deleteCandidate(
        req.params.id
      );
      if (!deletedCandidate) {
        res.status(404).json({ message: "Candidate not found" });
        return;
      }
      res
        .status(200)
        .json({ message: "Candidate deleted successfully", deletedCandidate });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
//adayın status bilgisi döner.
  public getCandidateStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;  // URL'den adayın id'sini alıyoruz
  
      const candidate = await this.candidateService.getCandidateById(id);
  
      if (!candidate) {
        res.status(404).json({ message: "Candidate not found" });
        return;
      }
  
      // Adayın sadece status bilgisini döndürüyoruz
      res.status(200).json({ status: candidate.status });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  //frontendden gelen yeni statusu günceller
  public updateCandidateStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;  // URL'den adayın id'sini alıyoruz
      const { status, note } = req.body;  // frontend'den status ve note alıyoruz
  
      if (!status) {
        res.status(400).json({ message: "Status is required" });
        return;
      }
  
      // `status` ve `note` alanlarını güncellemek için
      const updateData: { status: string; note?: string } = { status };
      if (note) {
        updateData.note = note;
      }
  
      const updatedCandidate = await this.candidateService.updateCandidate(id, updateData); // `status` ve `note` gönderiliyor
  
      if (!updatedCandidate) {
        res.status(404).json({ message: "Candidate not found" });
        return;
      }
  
      res.status(200).json(updatedCandidate);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
  

  //toplam aday sayısı ve pending aday sayısını alır
  public getCandidateStatsByInterviewId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { interviewId } = req.params;
  
      // Toplam aday sayısı ve pending aday sayısını al
      const totalCandidates = await this.candidateService.getTotalCandidatesByInterviewId(interviewId);
      const pendingCandidates = await this.candidateService.getPendingCandidatesByInterviewId(interviewId);
  
      // Sonuçları döndür
      res.status(200).json({
        totalCandidates,
        pendingCandidates
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
  

}
