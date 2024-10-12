import { Request, Response } from "express";
import applicationService from "../services/application.service";
import { TTokenPayload } from "../types";
import { Types } from "mongoose";

const applicationController = {
  // Existing method to get applications
  getApplications: async (req: Request, res: Response): Promise<void> => {
    const { user } = req.cookies;
    const userData: TTokenPayload = JSON.parse(user);

    const { status, createdAt } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    try {
      const result = await applicationService.getApplications(
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
      res
        .status(500)
        .json({ message: "Failed to retrieve applications", data: null });
    }
  },

  // New method to get application details by ID
  getApplicationById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
      const result = await applicationService.getApplicationById(id); // Call the service to get the application
      if (!result) {
        res.status(404).json({ message: "Application not found", data: null });
        return;
      }
      res
        .status(200)
        .json({ message: "Application retrieved successfully", data: result });
    } catch (error) {
      console.error("Error retrieving application:", error);
      res
        .status(500)
        .json({ message: "Failed to retrieve application", data: null });
    }
  },
};

export default applicationController;
