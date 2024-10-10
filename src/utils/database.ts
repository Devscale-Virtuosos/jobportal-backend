import mongoose from "mongoose";
import { env } from "./env";
import applicantModel from "../repositories/models/applicant.list.model";
import applicationModel from "../repositories/models/application.model";
import jobListModel from "../repositories/models/job.model";

// insert sample jobs data
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

// Insert sample applicants data
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

const insertApplication = async () => {
  const application = new applicationModel({
    user: {
      id: "asadas",
      name: "Indra",
    },
    jobDetail: {
      id: "asdasd",
      title: "Frontend Engineer",
      description: "FE using MERN Stack",
      experienceLevel: "Senior",
      company: {
        name: "Virtuosos",
        id: "asd123",
        userId: "asduser123",
        location: "Indonesia",
        industry: "IT",
        description: "IT Company",
        logo: "itlogo.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    },
    resumeId: "uuid",
    status: "applied",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  try {
    const savedApplication = await application.save();
    console.log("Application inserted:", savedApplication);
  } catch (error) {
    console.error("Error inserting application:", error);
  }
};

export const connectMongodb = async () => {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    console.log("MongoDB connected");

    // await insertApplicant();
    // await insertJob();
  } catch (error) {
    console.log("MongoDB connection failed!", error);
  }
};
