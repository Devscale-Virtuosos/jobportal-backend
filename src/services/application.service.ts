import ApplicationRepositories from "../repositories/application.repository";
import { IApplication } from "../repositories/models/application.model";
import { createError } from "../utils";

const ApplicationServices = {
  getApplications: async (
    filter: { status?: string; createdAt?: Date },
    page: number,
    limit: number
  ): Promise<IApplication[]> => {
    try {
      const applications = await ApplicationRepositories.getApplications(
        filter,
        page,
        limit
      );
      return applications;
    } catch (error) {
      throw createError(500, "Failed to fetch applications");
    }
  },

  softDeleteApplication: async (applicationId: string) => {
    try {
      const result = await ApplicationRepositories.softDeleteApplication(
        applicationId
      );
      if (!result) {
        throw createError(404, "Application not found");
      }
      return result;
    } catch (error) {
      throw createError(500, "Failed to delete application");
    }
  },

  // New method to get application by ID
  getApplicationById: async (id: string): Promise<IApplication | null> => {
    try {
      const application = await ApplicationRepositories.getApplicationById(id); // Call the repository method
      return application;
    } catch (error) {
      throw createError(500, "Failed to fetch application");
    }
  },
};

export default ApplicationServices;
