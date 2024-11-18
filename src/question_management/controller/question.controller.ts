import { Request, Response } from "express";
import { QuestionService } from "../service/question.service";
import { IQuestionDTO } from "../dto/question.dto";
import { Question } from "../entity/question";

export class QuestionController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  // Yeni bir soru oluşturma işlemi
  public createQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { questionText, tags, duration } = req.body;

      // DTO formatında yeni soruyu oluşturuyoruz
      const newQuestionData: IQuestionDTO = {
        questionText,
        tags,
        duration,
      };

      // DTO'yu kullanarak yeni soruyu kaydediyoruz
      const newQuestion = new Question(newQuestionData);
      await newQuestion.save();

      res.status(201).json(newQuestion);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // Tüm soruları getirme işlemi
  public getAllQuestions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Servis katmanından soruları alıyoruz
      const questions = await this.questionService.getAllQuestions();
      res.status(200).json(questions); // Doğrudan soruları döndürüyoruz
    } catch (error) {
      console.error("Error getting questions:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // Soru güncelleme işlemi
  public updateQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const questionId = req.params.id;
      const { questionText, duration, tags } = req.body;

      // Validate that the tags field is an array
      if (!Array.isArray(tags) || tags.length === 0) {
        res.status(400).json({ message: "Tags must be a non-empty array" });
        return;
      }

      // Other validations
      if (!questionId) {
        res.status(400).json({ message: "Soru ID gerekli" });
        return;
      }

      if (!questionText || questionText.trim() === "") {
        res.status(400).json({ message: "Soru metni gerekli" });
        return;
      }

      // Call the service layer to update the question
      const updatedQuestion = await this.questionService.updateQuestion(
        questionId,
        {
          questionText,
          duration,
          tags, // Pass the validated tags array
        } as IQuestionDTO
      );

      if (!updatedQuestion) {
        res.status(404).json({ message: "Soru bulunamadı" });
        return;
      }
      // Successful response
      res
        .status(200)
        .json({ message: "Soru başarıyla güncellendi", updatedQuestion });
    } catch (error) {
      console.error("Error updating question:", error);
      res
        .status(500)
        .json({ message: "Soru güncellenirken bir hata oluştu", error });
    }
  };
  // Belirli bir soruyu ID'ye göre getiren fonksiyon
  public getQuestionById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const questionId = req.params.id;

      // Veritabanında soruyu bul
      const question = await Question.findById(questionId);

      if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
      }

      // Başarılı şekilde soruyu döndür
      res.status(200).json(question);
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({ message: "Error fetching question", error });
    }
  };
  // Soru silme işlemi
  public deleteQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const questionId = req.params.id; // ID URL'den alınıyor

      // Gelen ID kontrol ediliyor
      if (!questionId) {
        res.status(400).json({ message: "Soru ID gerekli" });
        return;
      }

      // Service katmanına ID ile istek gönderiyoruz
      const deletedQuestion = await this.questionService.deleteQuestion(
        questionId
      );

      if (!deletedQuestion) {
        res.status(404).json({ message: "Soru bulunamadı" });
        return;
      }

      // Başarılı silme yanıtı
      res
        .status(200)
        .json({ message: "Soru başarıyla silindi", deletedQuestion });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
      });
    }
  };

  public reorderQuestions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { reorderedQuestions } = req.body;

      // Service katmanına istek gönderiyoruz
      await this.questionService.reorderQuestions(reorderedQuestions);

      res.status(200).json({ message: "Questions reordered successfully" });
    } catch (error) {
      console.error("Error reordering questions in controller:", error);
      res.status(500).json({ message: "Error reordering questions", error });
    }
  };
  // Tüm tag'leri listele
  public getAllTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const tags = await this.questionService.getAllTags();
      res.status(200).json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  };
  // Belirli bir tag'e göre soruları listele
  public getQuestionsByTag = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { tag } = req.params;
      const questions = await this.questionService.getQuestionsByTag(tag);
      res.status(200).json(questions); // Sadece 'questionText' ve 'duration' alanlarını döndürüyoruz
    } catch (error) {
      console.error("Error fetching questions by tag:", error);
      res.status(500).json({ error: "Failed to fetch questions by tag" });
    }
  };
}
