import { IJob } from "../repositories/models";

export interface JobListResponse {
  message: string;
  data: IJob[] | null;
}

export interface JobFilter {
  title?: string;
  experienceLevel?: string;
  type?: string;
  placementType?: string;
  location?: string;
}
