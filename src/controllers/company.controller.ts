import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { TTokenPayload } from "../types";
import { createError } from "../utils";
import { CompanyServices } from "../services";

const CompanyControllers = {
  handleUpdateCompany: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user } = req.cookies;
      const userData: TTokenPayload = JSON.parse(user);

      const companyId = req.params.companyId;
      const { userId, name, location, industry, description, logo } = req.body;

      // Cek apakah user id dalam cookie (user yang melakukan request) sama dengan userId dalam data company (pemilik company)
      if (userData!.id !== userId) {
        throw createError(400, "You are not allowed to update this company");
      }

      const updatedCompany = await CompanyServices.update(companyId, {
        userId: new Types.ObjectId(userId),
        name,
        location,
        industry,
        description,
        logo,
      });

      res
        .status(200)
        .json({ message: "Successfully update company", data: updatedCompany });
    } catch (error) {
      next(error);
    }
  },
};

export default CompanyControllers;
