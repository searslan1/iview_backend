import { Interview } from "../models/iview.schema";
import { v4 as uuidv4 } from 'uuid';
import { CreateInterviewDTO } from "../dto/iview.dto"; // DTO dosyasını import ettik
import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

const BASE_URL = process.env.BASE_URL;

class InterviewRepository {
  async create(interviewData: CreateInterviewDTO) {
    const interviewLink = uuidv4(); // UUID ile benzersiz link oluşturuluyor
    interviewData.link = `${BASE_URL}/interview/${interviewLink}`; // Benzersiz link ekleniyor
    const interview = new Interview(interviewData);
    return await interview.save();
  }

  async getAllInterviews() {
    return await Interview.find(); // Tüm mülakatları veritabanından çeker
  }

  async findByLink(link: string) {
    return await Interview.findOne({ link });
  }

  async findByUUID(uuid: string) {
    console.log("Repository layer UUID:", uuid);
    // UUID'nin link içinde yer aldığından emin olmak için regex kullanıyoruz
    return await Interview.findOne({ link: new RegExp(uuid) });
  }

  async findAll() {
    return await Interview.find().populate("candidates");
  }

  async update(id: string, updateData: Partial<CreateInterviewDTO>) {
    return await Interview.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string) {
    return await Interview.findByIdAndDelete(id);
  }

  async getInterviewById(id: string) {
    // Interview'ı bul ve soruların text ve duration alanlarını getir
    return await Interview.findById(id).populate('questions', 'questionText duration');
  }
}

export default InterviewRepository;
