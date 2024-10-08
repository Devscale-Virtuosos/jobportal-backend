import applicationModel, { IApplication } from "./models/application.model"; // Adjust path as necessary

interface ApplicationFilter {
  status?: string;
  createdAt?: Date;
}

const ApplicationRepositories = {
  getApplications: async (
    filter: ApplicationFilter,
    page: number,
    limit: number
  ): Promise<IApplication[]> => {
    const completeFilter: any = { deletedAt: null }; // Ensures soft deleted apps aren't fetched

    if (filter.status) completeFilter.status = filter.status;
    if (filter.createdAt) completeFilter.createdAt = { $gte: filter.createdAt };

    try {
      const applications = await applicationModel
        .find(completeFilter)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user jobDetail resumeId") // Assuming relationships with user and jobDetail
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
      const result = await applicationModel.findByIdAndUpdate(
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
      const application = await applicationModel
        .findOne({ _id: id, deletedAt: null })
        .populate("user jobDetail resumeId")
        .exec();
      return application;
    } catch (error) {
      console.error("Error retrieving application by ID:", error);
      throw new Error("Failed to retrieve application");
    }
  },
};

export default ApplicationRepositories;
