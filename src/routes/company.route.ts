import express from "express";
import { CompanyControllers } from "../controllers";
import { verifyAccessToken } from "../middlewares";

export const companyRouter = express.Router();

companyRouter.put(
  "/:companyId",
  verifyAccessToken,
  CompanyControllers.handleUpdateCompany
);
