import express from "express";
import { UserControllers } from "../controllers";
import { verifyAccessToken } from "../middlewares";

export const userRouter = express.Router();

userRouter.get(
  "/company",
  verifyAccessToken,
  UserControllers.handleGetUserCompany
);

userRouter.get("/jobs", verifyAccessToken, UserControllers.handleGetUserJobs);