import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export type TCompany = Omit<
  mongoose.InferSchemaType<typeof CompanySchema>,
  "createdAt" | "updatedAt" | "deletedAt"
>;

export default mongoose.model<TCompany>("Company", CompanySchema);
