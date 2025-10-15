"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAnalysis = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const callAnalysisSchema = new mongoose_1.default.Schema({
    Name: { type: String, required: true },
    Notes: { type: String, default: 'NA' },
    Overtime: { type: String, default: 'NA' },
    Position: { type: String, required: true },
    Availability: { type: String, default: 'NA' },
    Organization: { type: String, required: true },
    Transportaion: { type: String, default: 'NA' },
    PhoneScreeningScore: { type: Number, default: null },
    communicationAnalysis: { type: String, default: 'NA' },
    PhoneScreeningEvaluation: { type: String, default: 'NA' }
}, { timestamps: true });
exports.callAnalysis = mongoose_1.default.model('callAnalysis', callAnalysisSchema);
