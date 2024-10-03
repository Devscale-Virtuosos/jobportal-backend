import applicantRepository from "../repositories/applicant.list.repository";
import { ApplicantFilter, ApplicantListResponse } from "../types/applicantList";

const applicantServices = {
  getApplicants: async (
    filter: ApplicantFilter,
    page: number,
    limit: number
  ) => {
    try {
      const applicants = await applicantRepository.getApplicants(
        filter,
        page,
        limit
      );

      // Return the applicant data if found
      return applicants;
    } catch (error) {
      console.error("Error retrieving applicants:", error);
      throw error;
    }
  },

  // Call the softDeleteApplicant function
  softDeleteApplicant: async (id: string) => {
    try {
      return await applicantRepository.softDeleteApplicant(id);
    } catch (error) {
      console.error("Error in softDeleteApplicant service:", error);
      throw new Error("Failed to mark applicant as deleted");
    }
  },
};

export default applicantServices;
