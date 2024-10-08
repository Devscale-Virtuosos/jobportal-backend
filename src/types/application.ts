// src/types/application.types.ts
import { IApplication } from "../repositories/models/application.model"; // Adjust the path as needed

export interface ApplicationListResponse {
  message: string;
  data: IApplication[] | null;
}

export interface ApplicationFilter {
  status?: string;
  createdAt?: Date;
}
