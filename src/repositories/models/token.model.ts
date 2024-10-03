import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export type TToken = Omit<
  mongoose.InferSchemaType<typeof TokenSchema>,
  "createdAt" | "updatedAt"
>;

export default mongoose.model<TToken>("Token", TokenSchema);
