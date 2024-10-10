import { Types } from "mongoose";
import { htmlToText } from "html-to-text";
import {
  ApplicationRepositories,
  JobRepositories,
  ResumeRepositories,
} from "../repositories";
import JobRepository from "../repositories/job.repository";
import { TInputJob } from "../repositories/models/job.model";
import { TInputResume } from "../repositories/models/resume.model";
import { JobFilter } from "../types/jobList";
import { createError, generateErrorMessage, openai } from "../utils";
import {
  TInputJobDescriptionGeneration,
  validateApplyJob,
  validateInputGenerateJobDescription,
  validateInputJob,
} from "../validations/job";
import { APPLICATION_STATUS } from "../constants";

const jobListServices = {
  getJobList: async (filter: JobFilter, page: number, limit: number) => {
    try {
      const jobs = await JobRepositories.getJobList(filter, page, limit);

      return jobs;
    } catch (error) {
      console.error("Error retrieving job list:", error);
      throw error;
    }
  },
  softDeleteJob: async (id: string) => {
    try {
      return await JobRepositories.softDeleteJob(id);
    } catch (error) {
      console.error("Error in softDeleteJob service:", error);
      throw new Error("Failed to mark job as deleted");
    }
  },
  getJobDetailById: async (id: string) => {
    try {
      const jobDetail = await JobRepositories.getJobDetailById(id);
      if (!jobDetail || jobDetail.deletedAt) {
        throw createError(404, "Job not found");
      }

      return jobDetail;
    } catch (error) {
      console.error("Error retrieving job by ID:", error);
      throw error;
    }
  },
  getJobApplications: async (jobId: Types.ObjectId) => {
    try {
      const applications =
        ApplicationRepositories.getApplicationsByJobId(jobId);
      return applications;
    } catch (error) {
      throw error;
    }
  },
  createJob: async (jobData: TInputJob) => {
    try {
      // Input validation
      const validationResult = validateInputJob(jobData);
      if (!validationResult.success) {
        throw createError(
          400,
          generateErrorMessage(validationResult.error.issues)
        );
      }

      const job = await JobRepository.createJob(jobData);

      return job;
    } catch (error) {
      throw error;
    }
  },
  generateJobDescription: async (data: TInputJobDescriptionGeneration) => {
    try {
      // Input validation
      const validationResult = validateInputGenerateJobDescription(data);
      if (!validationResult.success) {
        throw createError(
          400,
          generateErrorMessage(validationResult.error.issues)
        );
      }

      // Generate job description using OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: 'You are an experienced Hiring Manager. You are skilled at defining job descriptions and requirements to be published, based on the role, experience level, and skills required by the job that you are informed about.\n\nThe job description you create consists of at least the short description, roles and responsibilities, key features that candidate must have, required skills, and benefits. Additionally, you can list any optional skills related to the job.\n\nIMPORTANT:\nExclude highlight characters like "**" , "#", etc.\n\nIMPORTANT:\nFor the title of "short description" and "key features that candidate must have" section, do not use it directly. Be creative, use other relevant words.',
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Draft a job requirements for the position of ${
                  data.experienceLevel
                } ${
                  data.title
                }, the required skills should include proficiency in ${data.requiredSkills.join(
                  ", "
                )}.`,
              },
            ],
          },
        ],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
          type: "text",
        },
      });

      const generatedJobDescription =
        response.choices?.[0].message.content ?? "";

      return generatedJobDescription;
    } catch (error) {
      throw error;
    }
  },
  updateJob: async (jobId: Types.ObjectId, updatedData: TInputJob) => {
    try {
      // Input validation
      const validationResult = validateInputJob(updatedData);
      if (!validationResult.success) {
        throw createError(
          400,
          generateErrorMessage(validationResult.error.issues)
        );
      }

      const updatedJob = await JobRepositories.update(jobId, updatedData);
      return updatedJob;
    } catch (error) {
      throw error;
    }
  },
  updateJobStatus: async (jobId: Types.ObjectId, status: string) => {
    try {
      // Input validation
      if (status) {
        throw createError(404, "status is required");
      }

      const updatedJob = await JobRepositories.updateStatus(jobId, status);
      return updatedJob;
    } catch (error) {
      throw error;
    }
  },
  applyJob: async (jobId: Types.ObjectId, data: TInputResume) => {
    try {
      // Input validation
      const validationResult = validateApplyJob(data);
      if (!validationResult.success) {
        throw createError(
          400,
          generateErrorMessage(validationResult.error.issues)
        );
      }

      // Save resume
      const resume = await ResumeRepositories.create(data);

      // Search Job
      const job = await JobRepositories.getJobDetailById(jobId.toString());
      if (!job) {
        throw createError(404, "Job not found");
      }

      // Compare resume with job description to get relevancy score
      const jobDescription = htmlToText(job.description);
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You are an experienced Hiring Manager. You are an expert in analyzing and selecting prospective employees by comparing job descriptions with applicant CVs.\n\nThe results of your analysis are in the form of a relevance percentage score (1 - 100). The higher the score, the more likely the applicant is to be accepted.\n\nIMPORTANT:\nTHE OUTPUT SHOULD BE ONLY VALID JSON WITH FOLLOWING KEYS:\n- relevancyScore: number\n\nIMPORTANT:\nExclude ``` (code wrapper) from the output.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Given the job description like this: \n\n${jobDescription}.\n\nCompare it with this resume and give the relevancy score: \n\n${resume.resumeText}`,
              },
            ],
          },
        ],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
          type: "text",
        },
      });

      const parsedResult = JSON.parse(
        response.choices?.[0].message.content ?? ""
      ) as {
        relevancyScore: number;
      };

      // Create applicant
      const application = await ApplicationRepositories.create({
        userId: data.userId,
        jobId,
        resumeId: resume._id,
        status: APPLICATION_STATUS.APPLIED,
        relevancyScore: parsedResult.relevancyScore,
      });

      return application;
    } catch (error) {
      throw error;
    }
  },
};

export default jobListServices;
