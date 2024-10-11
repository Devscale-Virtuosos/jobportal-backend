import mongoose from "mongoose";
import {
  EXPERIENCE_LEVEL,
  JOB_STATUS,
  JOB_TYPE,
  PLACEMENT_TYPE,
} from "../../constants";

const JobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    experienceLevel: {
      type: String,
      enum: [
        EXPERIENCE_LEVEL.JUNIOR,
        EXPERIENCE_LEVEL.MID_LEVEL,
        EXPERIENCE_LEVEL.SENIOR,
      ],
      required: true,
    },
    requiredSkills: [{ type: String, required: true }],
    type: {
      type: String,
      enum: [
        JOB_TYPE.FULL_TIME,
        JOB_TYPE.PART_TIME,
        JOB_TYPE.CONTRACT,
        JOB_TYPE.INTERNSHIP,
      ],
      required: true,
    },
    placementType: {
      type: String,
      enum: [
        PLACEMENT_TYPE.ON_SITE,
        PLACEMENT_TYPE.REMOTE,
        PLACEMENT_TYPE.HYBRID,
      ],
      required: true,
    },
    location: { type: String, required: false },
    status: {
      type: String,
      enum: [JOB_STATUS.DRAFT, JOB_STATUS.PUBLISHED, JOB_STATUS.CLOSED],
      default: JOB_STATUS.DRAFT,
    },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export type IJob = mongoose.InferSchemaType<typeof JobSchema>;

export type TInputJob = Omit<IJob, "createdAt" | "updatedAt" | "deletedAt">;

// Export model dengan interface IJob
export default mongoose.model<IJob>("Job", JobSchema);
