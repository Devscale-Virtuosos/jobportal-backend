import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  id: string;
  name: string;
}

export interface IJobDetail {
  id: string;
  userId: string;
  title: string;
  description: string;
  experienceLevel: string;
}

export interface IApplicant extends Document {
  user: IUser;
  jobDetail: IJobDetail;
  resumeId: string;
  status: string;
  relevancyScore: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const applicantSchema: Schema = new Schema<IApplicant>({
  user: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  jobDetail: {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    experienceLevel: { type: String, required: true },
  },
  resumeId: { type: String, required: true },
  status: { type: String, required: true },
  relevancyScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

export default mongoose.model<IApplicant>("Applicant", applicantSchema);
