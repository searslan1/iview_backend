import { QuestionRepository } from "../repository/question.repository";
import { IQuestionDTO } from "../dto/question.dto";
import { Question } from "../entity/question";

export class QuestionService {
  private questionRepository: QuestionRepository;

  constructor() {
    this.questionRepository = new QuestionRepository();
  }

  public async createQuestion(questionData: IQuestionDTO) {
    return await this.questionRepository.create(questionData);
  }

  public async getAllQuestions(): Promise<IQuestionDTO[]> {
    // Yalnızca `questionText`, `duration`, ve `tags` alanlarını alıyoruz
    return await Question.find().select("questionText duration tags").lean();
  }
  public async updateQuestion(questionId: string, questionData: IQuestionDTO) {
    return await this.questionRepository.update(questionId, questionData);
  }

  public async deleteQuestion(questionId: string) {
    return await this.questionRepository.delete(questionId);
  }

  public async reorderQuestions(reorderedQuestions: any[]) {
    for (const question of reorderedQuestions) {
      await this.questionRepository.updateOrder(question.id, question.order);
    }
    return true;
  }
  // Tüm tag'leri al
  public async getAllTags(): Promise<string[]> {
    // Repository'deki getAllTags metodunu çağırıyoruz
    return await this.questionRepository.getAllTags();
  }

  // Belirli bir tag'e göre soruları getir
  public async getQuestionsByTag(tag: string): Promise<IQuestionDTO[]> {
    // Repository'deki getQuestionsByTag metodunu çağırıyoruz
    return await this.questionRepository.getQuestionsByTag(tag);
  }
}

