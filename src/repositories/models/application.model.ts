import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobDetail: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      experienceLevel: { type: String, required: true },
      company: {
        name: { type: String, required: true },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
          required: true,
        },
        // Add other fields here
      },
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "interviewed", "offered", "rejected"],
      default: "applied",
    },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export type IApplication = mongoose.InferSchemaType<typeof ApplicationSchema>;

const applicationModel = mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);

export default applicationModel;
