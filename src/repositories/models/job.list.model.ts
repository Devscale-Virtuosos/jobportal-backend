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
  requiredSkills: string;
  experienceLevel: string;
  type: string;
  placementType: string;
  company: ICompany;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const jobSchema: Schema = new Schema<IJob>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  type: { type: String, required: true },
  placementType: { type: String, required: true },
  company: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

// Ekspor model dengan interface IJob
export default mongoose.model<IJob>("Job", jobSchema);
