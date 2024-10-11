import z from "zod";
import { Types } from "mongoose";
import { TInputJob } from "../repositories/models/job.model";
import { TInputResume } from "../repositories/models/resume.model";

export const inputJobDescriptionSchema = z.object({
  title: z.string().min(1, "required"),
  experienceLevel: z.string().min(1, "required"),
  requiredSkills: z.array(z.string()).min(1, "required"),
});

export type TInputJobDescriptionGeneration = z.infer<
  typeof inputJobDescriptionSchema
>;

export const validateInputGenerateJobDescription = (
  data: TInputJobDescriptionGeneration
) => {
  return inputJobDescriptionSchema.safeParse(data);
};

export const inputJobSchema = z.object({
  userId: z.instanceof(Types.ObjectId),
  companyId: z.instanceof(Types.ObjectId),
  title: z.string().min(1, "required"),
  experienceLevel: z.string().min(1, "required"),
  requiredSkills: z.array(z.string()).min(1, "required"),
  description: z.string().min(1, "required"),
  type: z.string().min(1, "required"),
  placementType: z.string().min(1, "required"),
  location: z.string().optional(),
  status: z.string().min(1, "required"),
});

export const validateInputJob = (company: TInputJob) => {
  return inputJobSchema.safeParse(company);
};

export const inputApplyJobSchema = z.object({
  userId: z.instanceof(Types.ObjectId),
  resumeText: z.string().min(1, "required"),
  skills: z.array(z.string()).min(1, "required"),
  yearOfExperience: z.number({ message: "required" }),
  education: z.string().min(1, "required"),
});

export const validateApplyJob = (data: TInputResume) => {
  return inputApplyJobSchema.safeParse(data);
};
