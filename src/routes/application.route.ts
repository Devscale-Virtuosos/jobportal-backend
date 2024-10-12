import { Router } from "express";
import applicationController from "../controllers/application.controller";
import { verifyAccessToken } from "../middlewares";

const applicationRouter = Router();

// Define routes for applicationRouter
applicationRouter.get(
  "/",
  verifyAccessToken,
  applicationController.getApplications
);
// New route to get application details by ID
applicationRouter.get(
  "/:id",
  verifyAccessToken,
  applicationController.getApplicationById
);

export { applicationRouter }; // Named export
