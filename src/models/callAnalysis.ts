import mongoose from 'mongoose';

const callAnalysisSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Notes: { type: String, default: 'NA' },
  Overtime:  { type: String, default: 'NA' },
  Position: { type: String, required: true },
  Availability: { type: String, default: 'NA' },
  Organization: { type: String, required: true },
  Transportaion: { type: String, default: 'NA' },
  PhoneScreeningScore: { type: Number, default: null },
  communicationAnalysis: { type: String, default: 'NA' },
  PhoneScreeningEvaluation: { type: String, default: 'NA' }
}, { timestamps: true });

export const callAnalysis = mongoose.model('callAnalysis', callAnalysisSchema);