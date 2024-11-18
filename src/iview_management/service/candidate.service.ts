import CandidateRepository from "../repository/candidate.repository";
import { CreateCandidateDTO } from "../dto/candidate.dto";
import { Candidate } from "../models/candidate.schema";

const candidateRepository = new CandidateRepository();

class CandidateService {
  async createCandidate(candidateData: CreateCandidateDTO) {
    return await candidateRepository.create(candidateData);
  }

  async getCandidateByInterviewId(interviewId: string) {
    const candidates = await candidateRepository.findByInterviewId(interviewId);
    return await candidateRepository.getPresignedUrlsForCandidates(candidates); // Presigned URL'leri aday bilgilerine ekleyerek döndür
  }

  async updateCandidate(id: string, updateData: Partial<CreateCandidateDTO>) {
    return await candidateRepository.update(id, updateData);
  }
  

  async deleteCandidate(id: string) {
    return await candidateRepository.delete(id);
  }

  async getCandidatesByInterviewId(interviewId: string) {
    return await Candidate.find({ interview: interviewId }).populate('interview');
  }

  async getCandidateById(id: string) {
    return await candidateRepository.findById(id);
  }

  async getTotalCandidatesByInterviewId(interviewId: string) {
    return await candidateRepository.countCandidatesByInterviewId(interviewId);
  }

  async getPendingCandidatesByInterviewId(interviewId: string) {
    return await candidateRepository.countPendingCandidatesByInterviewId(interviewId);
  }
}

export default CandidateService;