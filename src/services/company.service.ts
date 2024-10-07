import { CompanyRepositories } from "../repositories";
import { createError } from "../utils";
import { Types } from "mongoose"; // Pastikan ini diimport

const CompanyService = {
  // Fungsi lainnya...

  getCompanyById: async (companyId: string) => {
    // Konversi companyId dari string ke Types.ObjectId
    const id = new Types.ObjectId(companyId);

    const company = await CompanyRepositories.getById(id);
    if (!company) {
      throw createError(404, "Company not found");
    }
    return company;
  },
};

export default CompanyService;
