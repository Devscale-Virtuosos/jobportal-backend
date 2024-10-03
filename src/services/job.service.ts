import { JobRepositories } from "../repositories";
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
};

export default jobListServices;
