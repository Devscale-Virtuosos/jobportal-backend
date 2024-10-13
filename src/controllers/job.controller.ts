import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { JobFilter } from "../types/jobList";
import { CompanyServices, JobServices } from "../services";
import { createError } from "../utils";
import { TTokenPayload } from "../types";
import { JOB_STATUS } from "../constants";

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
      status: JOB_STATUS.PUBLISHED,
      placementType: placementType ? placementType.toString() : undefined,
      location: location ? location.toString() : undefined,
    };

    try {
      const result = await JobServices.getJobList(filter, page, limit);
      res
        .status(200)
        .json({ message: "Successfully retrieved jobs", data: result });
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
  getJobApplications: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params as { id: string };
    const jobId = new Types.ObjectId(id);
    try {
      const applications = await JobServices.getJobApplications(jobId);

      res.status(200).json({
        message: "Successfully get job applicantions",
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  },
  createJob: async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.cookies;
    const userData: TTokenPayload = JSON.parse(user);

    try {
      const {
        title,
        description,
        requiredSkills,
        experienceLevel,
        type,
        placementType,
        location,
        status,
      } = req.body;

      // Verify company existence
      const company = await CompanyServices.getCompanyByUserId(userData!.id);
      if (!company) {
        throw createError(404, "Company not found");
      }

      // Create new job
      const newJob = await JobServices.createJob({
        userId: new Types.ObjectId(userData!.id),
        companyId: company._id,
        title,
        description,
        requiredSkills,
        experienceLevel,
        type,
        placementType,
        location,
        status,
      });

      // Return success response
      res
        .status(201)
        .json({ message: "Job created successfully", data: newJob });
    } catch (error) {
      console.error("Error creating job:", error); // Log detailed error
      next(error); // Send generic error message
    }
  },
  generateJobDescription: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { title, experienceLevel, requiredSkills } = req.body;

      const result = await JobServices.generateJobDescription({
        title,
        experienceLevel,
        requiredSkills,
      });

      res.status(200).json({
        message: "Successfully generate job description",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  updateJob: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = new Types.ObjectId(req.params.id);
      const {
        userId,
        companyId,
        title,
        description,
        requiredSkills,
        experienceLevel,
        type,
        placementType,
        location,
        status,
      } = req.body;

      const updatedJob = await JobServices.updateJob(jobId, {
        userId: new Types.ObjectId(userId),
        companyId: new Types.ObjectId(companyId),
        title,
        description,
        requiredSkills,
        experienceLevel,
        type,
        placementType,
        location,
        status,
      });

      res
        .status(200)
        .json({ message: "Successfully update job", data: updatedJob });
    } catch (error) {
      next(error);
    }
  },
  updateJobStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = new Types.ObjectId(req.params.id);
      const { status } = req.body;

      const updatedJob = await JobServices.updateJobStatus(jobId, status);

      res
        .status(200)
        .json({ message: "Successfully update job status", data: updatedJob });
    } catch (error) {
      next(error);
    }
  },
  applyJob: async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.cookies;
    const userData: TTokenPayload = JSON.parse(user);

    try {
      const jobId = new Types.ObjectId(req.params.id);
      const { resumeText, skills, yearOfExperience, education } = req.body;

      await JobServices.applyJob(jobId, {
        userId: new Types.ObjectId(userData?.id),
        resumeText,
        skills,
        yearOfExperience,
        education,
      });

      res.status(200).json({ message: "Success apply to the job", data: null });
    } catch (error) {
      next(error);
    }
  },
};

export default JobControllers;
