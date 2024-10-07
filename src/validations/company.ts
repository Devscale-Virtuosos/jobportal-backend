import z from "zod";
import { TCompany } from "../repositories/models";

export const inputCompanySchema = z.object({
  userId: z.string(),
  name: z.string(),
  location: z.string(),
  industry: z.string(),
  description: z.string(),
  logo: z.string().optional(),
});

export const validateInputCompany = (company: TCompany) => {
  return inputCompanySchema.safeParse(company);
};
