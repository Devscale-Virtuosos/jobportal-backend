import { JobFilter } from "../types/jobList";
import jobListModel, { IJob } from "./models/job.list.model";

const jobListRepository = {
  getJobList: async (filter: JobFilter, page: number, limit: number): Promise<IJob[]> => {
    const completeFilter: any = { deletedAt: null };

    // Terapkan $regex untuk pencarian teks agar lebih fleksibel
    if (filter.title) completeFilter.title = { $regex: filter.title, $options: "i" };
    if (filter.experienceLevel) completeFilter.experienceLevel = filter.experienceLevel;
    if (filter.type) completeFilter.type = filter.type;
    if (filter.placementType) completeFilter.placementType = filter.placementType;
    if (filter.location) completeFilter["company.name"] = { $regex: filter.location, $options: "i" };

    try {
      const jobs = await jobListModel
        .find(completeFilter)
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
      const result = await jobListModel.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
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
      const jobDetail = await jobListModel.findById(id).exec();
      if (!jobDetail || jobDetail.deletedAt) {
        throw new Error("Job not found");
      }
      return jobDetail;
    } catch (error) {
      console.error("Error retrieving job detail:", error);
      throw new Error("Failed to retrieve job detail");
    }
  },
};

export default jobListRepository;
