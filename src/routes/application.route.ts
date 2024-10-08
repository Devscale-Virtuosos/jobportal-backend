import { Router } from "express";
import applicationController from "../controllers/application.controller";

const applicationRouter = Router();

// Define routes for applicationRouter
applicationRouter.get("/", applicationController.getApplications);
// New route to get application details by ID
applicationRouter.get("/:id", applicationController.getApplicationById); //

export { applicationRouter }; // Named export
