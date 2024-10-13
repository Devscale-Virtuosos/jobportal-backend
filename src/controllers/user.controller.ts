import type { NextFunction, Request, Response } from "express";
import { UserServices } from "../services";
import { TTokenPayload } from "../types";

const UserControllers = {
  handleGetUserCompany: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user } = req.cookies;
      const userData: TTokenPayload = JSON.parse(user);

      console.log({ cookies: req.cookies, user, userData });

      const userCompany = await UserServices.getCompany(userData!.id);

      res.status(200).json({
        message: "Successfully get user's company",
        data: userCompany,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default UserControllers;
