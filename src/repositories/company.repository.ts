import { Types } from "mongoose";
import { CompanyModel, TCompany } from "./models";

const CompanyRepositories = {
  getById: async (id: Types.ObjectId) => {
    try {
      const company = await CompanyModel.findById(id);
      return company;
    } catch (error) {
      throw error;
    }
  },
  getByUserId: async (userId: Types.ObjectId) => {
    try {
      const company = await CompanyModel.findOne({ userId });
      return company;
    } catch (error) {
      throw error;
    }
  },
  create: async (company: TCompany) => {
    try {
      const createCompany = new CompanyModel(company);
      const newCompany = await createCompany.save();
      return newCompany;
    } catch (error) {
      throw error;
    }
  },
  update: async (companyId: Types.ObjectId, updatedData: TCompany) => {
    try {
      const updatedCompany = await CompanyModel.findByIdAndUpdate(
        companyId,
        updatedData
      );
      return updatedCompany;
    } catch (error) {
      throw error;
    }
  },
};

export default CompanyRepositories;
