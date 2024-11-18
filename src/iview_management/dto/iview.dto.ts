export class CreateInterviewDTO {
  title: string;
  date: Date;
  questions: string[];
  status: string;
  link?: string;

  constructor({ title, date, questions, status, link }: Partial<CreateInterviewDTO>) {
    this.title = title || '';
    this.date = date || new Date();
    this.questions = questions || [];
    this.status = status || 'live';
    this.link = link;
  }
}
