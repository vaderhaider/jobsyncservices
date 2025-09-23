import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
}, { timestamps: true });

export const Item = mongoose.model('Item', itemSchema);
