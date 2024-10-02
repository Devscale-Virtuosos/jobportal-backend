import express from "express";
import { JobControllers } from "../controllers";

export const jobRouter = express.Router();

jobRouter.get("/", JobControllers.handleGetAllJobs);
