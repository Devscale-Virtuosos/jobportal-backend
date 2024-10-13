import type { NextFunction, Request, Response } from "express";
import { JobServices, UserServices } from "../services";
import { JobFilter, TTokenPayload } from "../types";

const UserControllers = {
  handleGetUserCompany: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user } = req.cookies;
      const userData: TTokenPayload = JSON.parse(user);

      const userCompany = await UserServices.getCompany(userData!.id);

      res.status(200).json({
        message: "Successfully get user's company",
        data: userCompany,
      });
    } catch (error) {
      next(error);
    }
  },
  // handle get jobs list created by user
  handleGetUserJobs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { user } = req.cookies;
    const userData: TTokenPayload = JSON.parse(user);

    const { title, experienceLevel, type, placementType, location } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

    // membangun filter berdasarkan query params
    const filter: JobFilter = {
      userId: userData?.id.toString(),
      title: title ? title.toString() : undefined,
      experienceLevel: experienceLevel ? experienceLevel.toString() : undefined,
      type: type ? type.toString() : undefined,
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
};

export default UserControllers;
