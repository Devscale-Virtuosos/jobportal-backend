import { NextFunction, Request, Response } from "express";
import { TTokenPayload } from "../types";
import { Types } from "mongoose";
import { createError } from "../utils";
import { ApplicationServices } from "../services";

const applicationController = {
  // Existing method to get applications
  getApplications: async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.cookies;
    const userData: TTokenPayload = JSON.parse(user);

    const { status, createdAt } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    try {
      const result = await ApplicationServices.getApplications(
        new Types.ObjectId(userData?.id),
        {
          status: status as string,
          createdAt: createdAt ? new Date(createdAt as string) : undefined,
        },
        page,
        limit
      );
      res.status(200).json({
        message: "Applications retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error retrieving applications:", error);
      next(error);
    }
  },

  // New method to get application details by ID
  getApplicationById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
      const result = await ApplicationServices.getApplicationById(id); // Call the service to get the application
      if (!result) {
        throw createError(404, "Application not found");
      }
      res
        .status(200)
        .json({ message: "Application retrieved successfully", data: result });
    } catch (error) {
      console.error("Error retrieving application:", error);
      next(error);
    }
  },

  updateApplicationStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const applicationId = new Types.ObjectId(req.params.id);
      const { status } = req.body;

      const updatedApplication =
        await ApplicationServices.updateApplicationStatus(
          applicationId,
          status
        );

      res.status(200).json({
        message: "Successfully update application status",
        data: updatedApplication,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default applicationController;
