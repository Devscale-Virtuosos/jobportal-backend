// conncect mongoDB

import mongoose from "mongoose";
import dotenv from "dotenv";
import jobListModel from "../repositories/models/job.list.model";

dotenv.config();

// insert sample data
const insertJob = async () => {
  const job = new jobListModel({
    title: "Software Engineer",
    description: "Develop and maintain software applications.",
    requiredSkills: "JavaScript, React, Node.js",
    experienceLevel: "Mid-level",
    type: "Full-time",
    placementType: "Remote",
    company: {
      id: "1234567",
      name: "Tech Company",
      logo: "http://example.com/logo.png",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  try {
    const savedJob = await job.save();
    console.log("Job inserted:", savedJob);
  } catch (error) {
    console.error("Error inserting job:", error);
  }
};

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
    await insertJob();
  } catch (error) {
    console.log(error);
  }
};
