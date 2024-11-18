export class CreateCandidateDTO {
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  kvkkApproval: boolean;
  videoUrl?: string;
  status?: string;
  note?: string;
  interview?: string; // Interview id'sini taşıyan alan

  constructor(data: {
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    kvkkApproval: boolean;
    videoUrl?: string;
    status?: string;
    note?: string;
    interview?: string;
  }) {
    this.name = data.name;
    this.surname = data.surname;
    this.phoneNumber = data.phoneNumber;
    this.email = data.email;
    this.kvkkApproval = data.kvkkApproval;
    this.videoUrl = data.videoUrl;
    this.status = data.status || "pending";
    this.note = data.note || "";
    this.interview = data.interview;
  }
}
