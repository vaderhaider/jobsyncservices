"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candidate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const candidateSchema = new mongoose_1.default.Schema({
    Role: { type: String, required: true },
    Score: { type: Number, required: true },
    Candidate: { type: String, required: true },
    Summary: { type: String, required: true },
    Concerns: { type: Array, required: true },
    Strengths: { type: Array, required: true },
    MandatoryRequirementsMet: { type: String, required: true },
    ReachOut: { type: Boolean, default: false }
}, { timestamps: true });
exports.Candidate = mongoose_1.default.model('Candidate', candidateSchema);
