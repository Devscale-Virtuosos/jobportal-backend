// src/routes/applicant.route.ts
import { Router } from "express";
import { applicantControllers } from "../controllers";

export const applicantRouter = Router();

// Mendapatkan daftar applicants
applicantRouter.get("/", applicantControllers.getApplicants);

// Menghapus applicant berdasarkan ID dengan soft delete
applicantRouter.delete("/:id", applicantControllers.deleteApplicant);
