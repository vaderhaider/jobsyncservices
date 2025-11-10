import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  Role: { type: String, required: true },
  Score: { type: Number, required: true },
  Candidate: { type: String, required: true },
  Summary: { type: String, required: true },
  Concerns: { type: Array, required: true },
  Strengths: { type: Array, required: true },
  MandatoryRequirementsMet: { type: String, required: true },
  ReachOut: { type: Boolean, default: false },
  jobID: { type: String, required: false }
}, { timestamps: true });

export const Candidate = mongoose.model('Candidate', candidateSchema);