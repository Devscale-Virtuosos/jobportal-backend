// src/routes/applicant.route.ts
import { Router } from "express";
import applicantControllers from "../controllers/applicant.list.controller";

const router = Router();

// Mendapatkan daftar applicants
router.get("/", applicantControllers.getApplicants);

// Menghapus applicant berdasarkan ID dengan soft delete
router.delete("/:id", applicantControllers.deleteApplicant);

export default router;
