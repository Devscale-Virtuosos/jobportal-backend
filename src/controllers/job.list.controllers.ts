import { Request, Response } from "express";
import { JobFilter } from "../types/jobList";
import jobListServices from "../services/job.list.service";

const jobListControllers = {
  getJobList: async (req: Request, res: Response) => {
    const { title, experienceLevel, type, placementType, location } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

    // membangun filter berdasarkan query params
    const filter: JobFilter = {
      title: title ? title.toString() : undefined,
      experienceLevel: experienceLevel ? experienceLevel.toString() : undefined,
      type: type ? type.toString() : undefined,
      placementType: placementType ? placementType.toString() : undefined,
      location: location ? location.toString() : undefined,
    };

    try {
      const result = await jobListServices.getJobList(filter, page, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", data: null });
    }
  },

  deleteJob: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };

    try {
      const result = await jobListServices.softDeleteJob(id); // Panggil service untuk soft delete
      if (result) {
        res.status(200).json({
          message: "Successfully marked job as deleted",
          data: result,
        });
      } else {
        res.status(404).json({
          message: "Job not found",
          data: null,
        });
      }
    } catch (error) {
      console.error("Error marking job as deleted:", error);
      res.status(500).json({
        message: "Failed to mark job as deleted",
        data: null,
      });
    }
  },
};

export default jobListControllers;
