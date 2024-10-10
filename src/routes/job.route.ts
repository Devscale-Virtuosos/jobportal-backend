import { Router } from "express";
import { JobControllers } from "../controllers";
import { verifyAccessToken } from "../middlewares";

export const jobRouter = Router();

jobRouter.get("/", JobControllers.getJobList);
jobRouter.get("/:id", JobControllers.getJobDetailById);
jobRouter.get(
  "/:id/applications",
  verifyAccessToken,
  JobControllers.getJobApplications
);
jobRouter.delete("/:id", verifyAccessToken, JobControllers.deleteJob);

jobRouter.post("/", verifyAccessToken, JobControllers.createJob);
jobRouter.post(
  "/generate/description",
  verifyAccessToken,
  JobControllers.generateJobDescription
);
jobRouter.post("/:id/apply", verifyAccessToken, JobControllers.applyJob);
jobRouter.put("/:id", verifyAccessToken, JobControllers.updateJob);
jobRouter.patch(
  "/:id/status",
  verifyAccessToken,
  JobControllers.updateJobStatus
);
