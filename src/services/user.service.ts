import { Types } from "mongoose";
import { CompanyRepositories } from "../repositories";

const UserServices = {
  getCompany: async (userId: Types.ObjectId) => {
    try {
      const userCompany = CompanyRepositories.getByUserId(userId);
      return userCompany;
    } catch (error) {
      throw error;
    }
  },
};

export default UserServices;
