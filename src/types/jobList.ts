import { IJob } from "../repositories/models";

export interface JobListResponse {
  message: string;
  data: IJob[] | null;
}

export interface JobFilter {
  userId?: string;
  title?: string;
  experienceLevel?: string;
  type?: string;
  status?: string;
  placementType?: string;
  location?: string;
}
