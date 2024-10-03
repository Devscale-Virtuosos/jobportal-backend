import applicantModel, { IApplicant } from "./models/applicant.list.model"; // Assuming the existence of a model for applicants

interface ApplicantFilter {
  status?: string;
  createdAt?: Date;
}

const applicantRepository = {
  getApplicants: async (
    filter: ApplicantFilter,
    page: number,
    limit: number
  ): Promise<IApplicant[]> => {
    const completeFilter: any = { deletedAt: null };

    // Apply filters based on the query params
    if (filter.status) completeFilter.status = filter.status;
    if (filter.createdAt) completeFilter.createdAt = { $gte: filter.createdAt };

    try {
      const applicants = await applicantModel
        .find(completeFilter)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user jobDetail") // Assuming relationships with user and jobDetail
        .exec();

      console.log("Retrieved Applicants:", applicants);

      return applicants;
    } catch (error) {
      console.error("Error retrieving applicants:", error);
      throw new Error("Failed to retrieve applicants");
    }
  },

  softDeleteApplicant: async (id: string) => {
    try {
      const result = await applicantModel.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
      if (!result) {
        throw new Error("Applicant not found");
      }
      return result;
    } catch (error) {
      console.error("Error deleting applicant:", error);
      throw new Error("Failed to delete applicant");
    }
  },
};

export default applicantRepository;
