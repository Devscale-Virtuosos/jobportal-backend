import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../../constants";

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    status: {
      type: String,
      enum: [
        APPLICATION_STATUS.APPLIED,
        APPLICATION_STATUS.REVIEWED,
        APPLICATION_STATUS.IN_PROGRESS,
        APPLICATION_STATUS.ACCEPTED,
        APPLICATION_STATUS.REJECTED,
      ],
      default: APPLICATION_STATUS.APPLIED,
    },
    relevancyScore: { type: Number, required: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export type IApplication = mongoose.InferSchemaType<typeof ApplicationSchema>;

export type TInputApplication = Omit<
  IApplication,
  "createdAt" | "updatedAt" | "deletedAt"
>;

export default mongoose.model<IApplication>("Application", ApplicationSchema);
