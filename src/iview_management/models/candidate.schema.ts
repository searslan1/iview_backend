import mongoose from "mongoose";

export const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  kvkkApproval: { type: Boolean, required: true },
  videoUrl: { type: String },
  status: { type: String, default: "pending" }, // initial status is pending
  note: { type: String, default: "" },  // Başlangıçta boş olacak
  interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" }  // Adayın hangi mülakata katıldığı
});

export const Candidate = mongoose.model("Candidate", CandidateSchema);
