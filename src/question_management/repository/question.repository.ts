import { Question } from "../entity/question";
import { IQuestionDTO } from "../dto/question.dto";

export class QuestionRepository {
  public async create(questionData: IQuestionDTO) {
    const newQuestion = new Question(questionData);
    return await newQuestion.save();
  }

  public async findAll() {
    return await Question.find();
  }

  public async findById(questionId: string) {
    return await Question.findById(questionId);
  }

  public async update(questionId: string, questionData: IQuestionDTO) {
    return await Question.findByIdAndUpdate(questionId, questionData, {
      new: true,
    });
  }
  // Tüm tag'leri almak
  public async getAllTags(): Promise<string[]> {
    return await Question.distinct("tags"); // 'tags' alanındaki tüm benzersiz değerleri alır
  }

  // Belirli bir tag'e göre soruları ve süreleri getirmek
  public async getQuestionsByTag(tag: string) {
    return await Question.find({ tags: tag })
      .select("questionText duration") // Sadece 'questionText' ve 'duration' alanlarını seçiyoruz
      .lean();
  }
  public async delete(questionId: string) {
    return await Question.findByIdAndDelete(questionId);
  }

  public async updateOrder(questionId: string, order: number) {
    return await Question.findByIdAndUpdate(questionId, { order });
  }
}
