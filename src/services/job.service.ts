import { JobRepositories } from "../repositories";
import JobRepository from "../repositories/job.repository";
import { IJob } from "../repositories/models/job.list.model";
import { JobFilter, JobListResponse } from "../types/jobList";
import { createError } from "../utils";

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
  // Panggil fungsi softDeleteJob
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

  // src/services/job.list.service.ts
  createJob: async (jobData: IJob): Promise<{ message: string; data: IJob | null }> => {
    try {
      const job = await JobRepository.createJob(jobData);
      return job;
    } catch (error) {
      console.error("Error creating job:", error);
      throw new Error("Failed to create job");
    }
  },
};

export default jobListServices;
