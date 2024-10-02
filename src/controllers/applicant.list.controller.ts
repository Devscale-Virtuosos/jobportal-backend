import { Request, Response } from "express";
import applicantServices from "../services/applicant.list.service"; // Assuming the service for applicant data exists

const applicantControllers = {
  getApplicants: async (req: Request, res: Response): Promise<void> => {
    const { status, createdAt } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

    // Building filter based on query params
    const filter = {
      status: status ? status.toString() : undefined,
      createdAt: createdAt ? new Date(createdAt.toString()) : undefined,
    };

    try {
      const result = await applicantServices.getApplicants(filter, page, limit);
      res.status(200).json({
        message: "Berhasil mendapatkan data applicants",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
      res.status(500).json({
        message: "Internal server error",
        data: null,
      });
    }
  },

  deleteApplicant: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };

    try {
      const result = await applicantServices.softDeleteApplicant(id); // Assuming a soft delete functionality
      if (result) {
        res.status(200).json({
          message: "Successfully marked applicant as deleted",
          data: result,
        });
      } else {
        res.status(404).json({
          message: "Applicant not found",
          data: null,
        });
      }
    } catch (error) {
      console.error("Error marking applicant as deleted:", error);
      res.status(500).json({
        message: "Failed to mark applicant as deleted",
        data: null,
      });
    }
  },
};

export default applicantControllers;
