import { NextFunction, Request, Response } from "express";
import { ApplicationServices } from "../services"; // Assuming the service for applicant data exists
import { createError } from "../utils";

const applicantControllers = {
  getApplicants: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { status, createdAt } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

    // Building filter based on query params
    const filter = {
      status: status ? status.toString() : undefined,
      createdAt: createdAt ? new Date(createdAt.toString()) : undefined,
    };

    try {
      const result = await ApplicationServices.getApplicants(
        filter,
        page,
        limit
      );
      res.status(200).json({
        message: "Berhasil mendapatkan data applicants",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
      next(error);
    }
  },

  deleteApplicant: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params as { id: string };

    try {
      const result = await ApplicationServices.softDeleteApplicant(id); // Assuming a soft delete functionality
      if (result) {
        res.status(200).json({
          message: "Successfully marked applicant as deleted",
          data: result,
        });
      } else {
        throw createError(404, "Application not found");
      }
    } catch (error) {
      console.error("Error marking applicant as deleted:", error);
      next(error);
    }
  },
};

export default applicantControllers;
