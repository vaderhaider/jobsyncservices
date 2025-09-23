"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizationName: { type: String, required: true },
    location: { type: String, required: true },
    requirements: { type: Array, required: true },
}, { timestamps: true });
exports.Job = mongoose_1.default.model('Job', jobSchema);
