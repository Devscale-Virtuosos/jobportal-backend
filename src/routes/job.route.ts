// src/routes/job.list.route.ts
import { Router } from "express";
import { JobControllers } from "../controllers";

export const jobRouter = Router();

// Mendapatkan daftar pekerjaan
jobRouter.get("/", JobControllers.getJobList);

// Menghapus pekerjaan berdasarkan ID dengan soft delete
jobRouter.delete("/:id", JobControllers.deleteJob);

jobRouter.get("/:id", JobControllers.getJobDetailById);
jobRouter.post("/", JobControllers.createJob);
