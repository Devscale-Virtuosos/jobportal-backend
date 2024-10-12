import { Types } from "mongoose";
import { ApplicationModel, IApplication, TInputApplication } from "./models";

interface ApplicationFilter {
  status?: string;
  createdAt?: Date;
}

const ApplicationRepositories = {
  create: async (data: TInputApplication) => {
    try {
      const application = new ApplicationModel(data);
      const savedApplication = application.save();

      return savedApplication;
    } catch (error) {
      throw error;
    }
  },
  getApplications: async (
    userId: Types.ObjectId,
    filter: ApplicationFilter,
    page: number,
    limit: number
  ): Promise<IApplication[]> => {
    const completeFilter: any = { userId, deletedAt: null }; // Ensures soft deleted apps aren't fetched

    if (filter.status) completeFilter.status = filter.status;
    if (filter.createdAt) completeFilter.createdAt = { $gte: filter.createdAt };

    try {
      const applications = await ApplicationModel.find(completeFilter)
        .select("-relevancyScore")
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("userId resumeId")
        .populate({ path: "jobId", populate: { path: "companyId" } })
        .exec();

      console.log("Retrieved Applications:", applications);
      return applications;
    } catch (error) {
      console.error("Error retrieving applications:", error);
      throw new Error("Failed to retrieve applications");
    }
  },

  softDeleteApplication: async (id: string) => {
    try {
      const result = await ApplicationModel.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
      if (!result) {
        throw new Error("Application not found");
      }
      return result;
    } catch (error) {
      console.error("Error deleting application:", error);
      throw new Error("Failed to delete application");
    }
  },

  // New method to get application by ID
  getApplicationById: async (id: string): Promise<IApplication | null> => {
    try {
      const application = await ApplicationModel.findOne({
        _id: id,
        deletedAt: null,
      })
        .populate("user jobDetail resumeId")
        .exec();
      return application;
    } catch (error) {
      console.error("Error retrieving application by ID:", error);
      throw new Error("Failed to retrieve application");
    }
  },
  getApplicationsByJobId: async (jobId: Types.ObjectId) => {
    try {
      const applications = await ApplicationModel.find({ jobId })
        .populate("userId", "name email picture")
        .populate("resumeId", "skills yearOfExperience education");
      return applications;
    } catch (error) {
      throw error;
    }
  },
};

export default ApplicationRepositories;
