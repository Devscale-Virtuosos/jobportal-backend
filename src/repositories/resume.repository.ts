import { ResumeModel, TInputResume } from "./models";

const ResumeRepositories = {
  create: async (data: TInputResume) => {
    try {
      const job = new ResumeModel(data);
      const savedJob = await job.save();

      return savedJob;
    } catch (error) {
      throw error;
    }
  },
};

export default ResumeRepositories;
