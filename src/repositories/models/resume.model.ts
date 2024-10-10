import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeText: { type: String, required: true },
    skills: [{ type: String, required: true }],
    yearOfExperience: { type: Number, required: true },
    education: { type: String, required: true },
  },
  { timestamps: true }
);

export type TResume = mongoose.InferSchemaType<typeof ResumeSchema>;

export type TInputResume = Omit<
  TResume,
  "createdAt" | "updatedAt" | "deletedAt"
>;

export default mongoose.model<TResume>("Resume", ResumeSchema);
