import mongoose from "mongoose";
import { ROLE } from "../../constants";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String },
    role: {
      type: String,
      enum: [ROLE.RECRUITER, ROLE.JOB_HUNTER],
      default: ROLE.JOB_HUNTER,
    },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export type TUser = Omit<
  mongoose.InferSchemaType<typeof UserSchema>,
  "createdAt" | "updatedAt" | "deletedAt"
>;

export default mongoose.model<TUser>("User", UserSchema);
