import mongoose from "mongoose";
import dotenv from "dotenv";
import applicantModel from "../repositories/models/applicant.list.model";

dotenv.config();

// Insert sample applicant data
const insertApplicant = async () => {
  const applicant = new applicantModel({
    user: {
      id: "user123",
      name: "Indra",
    },
    jobDetail: {
      id: "job123",
      userId: "user123",
      title: "Frontend Engineer",
      description: "Develop and maintain frontend applications.",
      experienceLevel: "Mid-level",
    },
    resumeId: "resume123",
    status: "Pending",
    relevancyScore: 85,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  try {
    const savedApplicant = await applicant.save();
    console.log("Applicant inserted:", savedApplicant);
  } catch (error) {
    console.error("Error inserting applicant:", error);
  }
};

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
    await insertApplicant();
  } catch (error) {
    console.log(error);
  }
};
