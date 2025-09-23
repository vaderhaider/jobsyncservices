import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizationName: { type: String, required: true },
  location: { type: String, required: true },
  requirements: { type: Array, required: true },
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);