import { Types } from "mongoose";
import { JobFilter } from "../types/jobList";
import { JobModel, IJob, TInputJob } from "./models";

const JobRepository = {
  getJobList: async (
    filter: JobFilter,
    page: number,
    limit: number
  ): Promise<IJob[]> => {
    const completeFilter: any = { deletedAt: null };

    // Terapkan $regex untuk pencarian teks agar lebih fleksibel
    if (filter.title)
      completeFilter.title = { $regex: filter.title, $options: "i" };
    if (filter.experienceLevel)
      completeFilter.experienceLevel = filter.experienceLevel;
    if (filter.type) completeFilter.type = filter.type;
    if (filter.placementType)
      completeFilter.placementType = filter.placementType;
    if (filter.location)
      completeFilter["company.name"] = {
        $regex: filter.location,
        $options: "i",
      };

    try {
      const jobs = await JobModel.find(completeFilter)
        .populate("companyId")
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      console.log("Retrieved Jobs:", jobs);

      return jobs;
    } catch (error) {
      console.error("Error retrieving job list:", error);
      throw new Error("Failed to retrieve job list");
    }
  },

  softDeleteJob: async (id: string) => {
    try {
      const result = await JobModel.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
      if (!result) {
        throw new Error("Job not found");
      }
      return result;
    } catch (error) {
      console.error("Error deleting job:", error);
      throw new Error("Failed to delete job");
    }
  },

  getJobDetailById: async (id: string) => {
    try {
      const jobDetail = await JobModel.findOne({ _id: id, deletedAt: null })
        .populate("companyId")
        .exec();

      // if (!jobDetail || jobDetail.deletedAt) {
      //   throw new Error("Job not found");
      // }
      return jobDetail;
    } catch (error) {
      console.error("Error retrieving job detail:", error);
      throw new Error("Failed to retrieve job detail");
    }
  },
  createJob: async (jobData: TInputJob) => {
    try {
      const job = new JobModel(jobData);
      const savedJob = await job.save();

      return savedJob;
    } catch (error) {
      console.error("Error creating job:", error);
      throw new Error("Failed to create job");
    }
  },
  update: async (jobId: Types.ObjectId, updatedData: TInputJob) => {
    try {
      const updatedJob = await JobModel.findByIdAndUpdate(jobId, updatedData);
      return updatedJob;
    } catch (error) {
      throw error;
    }
  },
  updateStatus: async (jobId: Types.ObjectId, status: string) => {
    try {
      const updatedJob = await JobModel.findByIdAndUpdate(jobId, { status });
      return updatedJob;
    } catch (error) {
      throw error;
    }
  },
};

export default JobRepository;
