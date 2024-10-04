import mongoose, { Document, Schema } from "mongoose";

export interface ICompany {
  id: string;
  name: string;
  logo: string;
}

export interface IJob extends Document {
  // Extend Document agar dapat digunakan dengan Mongoose
  title: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: string;
  type: string;
  placementType: string;
  company: ICompany;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// src/models/job.model.ts
const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  requiredSkills: [{ type: String, required: true }],
  type: { type: String, enum: ["full_time", "part_time"], required: true },
  placementType: { type: String, enum: ["onsite", "remote", "hybrid"], required: true },
  location: { type: String, required: false },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ekspor model dengan interface IJob
export default mongoose.model<IJob>("Job", jobSchema);
