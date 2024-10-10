import { CompanyRepositories } from "../repositories";
import { TCompany } from "../repositories/models";
import { createError, generateErrorMessage } from "../utils";
import { Types } from "mongoose"; // Pastikan ini diimport
import { validateInputCompany } from "../validations";

const CompanyServices = {
  getCompanyById: async (companyId: string) => {
    // Konversi companyId dari string ke Types.ObjectId
    const id = new Types.ObjectId(companyId);

    const company = await CompanyRepositories.getById(id);
    if (!company) {
      throw createError(404, "Company not found");
    }
    return company;
  },
  getCompanyByUserId: async (userId: Types.ObjectId) => {
    try {
      const userCompany = await CompanyRepositories.getByUserId(userId);
      return userCompany;
    } catch (error) {
      throw error;
    }
  },
  update: async (companyId: string, updatedData: TCompany) => {
    try {
      // Input validation
      const validationResult = validateInputCompany(updatedData);
      if (!validationResult.success) {
        throw createError(
          400,
          generateErrorMessage(validationResult.error.issues)
        );
      }

      // Konversi companyId dari string ke Types.ObjectId
      const id = new Types.ObjectId(companyId);

      const updatedCompany = await CompanyRepositories.update(id, updatedData);

      return updatedCompany;
    } catch (error) {
      throw error;
    }
  },
};

export default CompanyServices;
