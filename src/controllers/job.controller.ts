import { NextFunction, Request, Response } from "express";
import { JobFilter } from "../types/jobList";
import { JobServices } from "../services";
import { createError } from "../utils";

const JobControllers = {
  getJobList: async (req: Request, res: Response, next: NextFunction) => {
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
      const result = await JobServices.getJobList(filter, page, limit);
      res.status(200).json({ message: "Successfully retrieved jobs", data: result });
    } catch (error) {
      next(error);
    }
  },
  deleteJob: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    try {
      const result = await JobServices.softDeleteJob(id); // Panggil service untuk soft delete
      if (result) {
        res.status(200).json({
          message: "Successfully marked job as deleted",
          data: result,
        });
      } else {
        throw createError(404, "Job not found");
      }
    } catch (error) {
      console.error("Error marking job as deleted:", error);
      next(error);
    }
  },
  getJobDetailById: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    try {
      const jobDetail = await JobServices.getJobDetailById(id);
      if (jobDetail) {
        res.status(200).json({
          message: "Successfully retrieved job detail",
          data: jobDetail,
        });
      } else {
        throw createError(404, "Job not found");
      }
    } catch (error) {
      console.error("Error fetching job detail:", error);
      next(error);
    }
  },

  createJob: async (req: Request, res: Response, next: NextFunction) => {
    const jobData = req.body;
    try {
      const job = await JobServices.createJob(jobData);
      if (job) {
        res.status(201).json({
          message: "Successfully created job",
          data: job,
        });
      } else {
        throw createError(400, "Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      next(error);
    }
  },
};

export default JobControllers;
