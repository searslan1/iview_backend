import InterviewRepository from "../repository/iview.repository";
import { CreateInterviewDTO } from "../dto/iview.dto";

class InterviewService {
  interviewRepository: InterviewRepository;

  constructor() {
    this.interviewRepository = new InterviewRepository(); 
  }

  async createInterview(interviewData: CreateInterviewDTO) {
    return await this.interviewRepository.create(interviewData);
  }

  async getAllInterviews() {
    return await this.interviewRepository.getAllInterviews();
  }

  async getInterviewByLink(link: string) {
    return await this.interviewRepository.findByLink(link);
  }

  async getInterviewByUUID(uuid: string) {
    console.log("Service layer UUID:", uuid);
    return await this.interviewRepository.findByUUID(uuid);
  }

  async getInterviewById(id: string) {
    return await this.interviewRepository.getInterviewById(id);
  }

  async updateInterview(id: string, updateData: Partial<CreateInterviewDTO>) { // updateData için Partial<CreateInterviewDTO> kullanıyoruz
    return await this.interviewRepository.update(id, updateData);
  }

  async deleteInterview(id: string) {
    return await this.interviewRepository.delete(id);
  }
}

export default InterviewService;
