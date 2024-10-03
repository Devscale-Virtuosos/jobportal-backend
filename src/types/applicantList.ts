import { IApplicant } from "../repositories/models/applicant.list.model";

export interface ApplicantListResponse {
  message: string;
  data: IApplicant[] | null;
}

export interface ApplicantFilter {
  status?: string;
  createdAt?: Date;
}
