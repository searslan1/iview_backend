import { Interview } from "../models/iview.schema";
import { v4 as uuidv4 } from 'uuid';
import { CreateInterviewDTO } from "../dto/iview.dto";  // DTO dosyasını import ettik

class InterviewRepository {
  async create(interviewData: CreateInterviewDTO) {  // interviewData için CreateInterviewDTO kullanıyoruz
    const interviewLink = uuidv4(); // UUID ile benzersiz link oluşturuluyor
    interviewData.link = `http://localhost:5174/interview/${interviewLink}`; // Benzersiz link ekleniyor
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
    // UUID'nin link içinde yer aldığından ve regex kullanarak arıyoruz
    return await Interview.findOne({ link: new RegExp(uuid) });
  }

  async findAll() {
    return await Interview.find().populate("candidates");
  }

  async update(id: string, updateData: Partial<CreateInterviewDTO>) {  // updateData için Partial kullanıyoruz
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
