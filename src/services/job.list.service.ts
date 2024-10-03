import jobListRepository from "../repositories/job.list.repository";
import { JobFilter, JobListResponse } from "../types/jobList";

const jobListServices = {
  getJobList: async (filter: JobFilter, page: number, limit: number): Promise<JobListResponse> => {
    try {
      const jobs = await jobListRepository.getJobList(filter, page, limit);
      // validasi jika data job list tidak ada
      if (jobs.length === 0) {
        return {
          message: "No jobs found",
          data: null,
        };
      }
      // mengembalikan data job list jika ada
      return {
        message: "Successfully retrieved jobs",
        data: jobs,
      };
    } catch (error) {
      console.error("Error retrieving job list:", error);
      return {
        message: "Failed to retrieve job list",
        data: null,
      };
    }
  },
  // Panggil fungsi softDeleteJob
  softDeleteJob: async (id: string) => {
    try {
      return await jobListRepository.softDeleteJob(id);
    } catch (error) {
      console.error("Error in softDeleteJob service:", error);
      throw new Error("Failed to mark job as deleted");
    }
  },

  getJobDetailById: async (id: string) => {
    try {
      const jobDetail = await jobListRepository.getJobDetailById(id);
      if (!jobDetail || jobDetail.deletedAt) {
        return {
          message: "Job not found",
          data: null,
        };
      }
      return {
        message: "Successfully retrieved job detail",
        data: jobDetail,
      };
    } catch (error) {
      console.error("Error retrieving job by ID:", error);
      return { message: "Failed to retrieve job", data: null };
    }
  },
};

export default jobListServices;
