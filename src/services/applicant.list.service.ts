import applicantRepository from "../repositories/applicant.list.repository";
import { ApplicantFilter, ApplicantListResponse } from "../types/applicantList";

const applicantServices = {
  getApplicants: async (
    filter: ApplicantFilter,
    page: number,
    limit: number
  ): Promise<ApplicantListResponse> => {
    try {
      const applicants = await applicantRepository.getApplicants(
        filter,
        page,
        limit
      );
      // Validate if no applicants are found
      if (applicants.length === 0) {
        return {
          message: "No applicants found",
          data: null,
        };
      }
      // Return the applicant data if found
      return {
        message: "Successfully retrieved applicants",
        data: applicants,
      };
    } catch (error) {
      console.error("Error retrieving applicants:", error);
      return {
        message: "Failed to retrieve applicants",
        data: null,
      };
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
