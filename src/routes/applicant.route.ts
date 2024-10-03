// src/routes/applicant.route.ts
import { Router } from "express";
import { ApplicantControllers } from "../controllers";

export const applicantRouter = Router();

// Mendapatkan daftar applicants
applicantRouter.get("/", ApplicantControllers.getApplicants);

// Menghapus applicant berdasarkan ID dengan soft delete
applicantRouter.delete("/:id", ApplicantControllers.deleteApplicant);
