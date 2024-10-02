// src/routes/job.list.route.ts
import { Router } from "express";
import jobListControllers from "../controllers/job.list.controllers";

const router = Router();

// Mendapatkan daftar pekerjaan
router.get("/", jobListControllers.getJobList);

// Menghapus pekerjaan berdasarkan ID dengan soft delete
router.delete("/:id", jobListControllers.deleteJob);

export default router;
