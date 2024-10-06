import { Types } from "mongoose";
import { TToken, TokenModel } from "./models";

const TokenRepositories = {
  getByUserId: async (userId: Types.ObjectId) => {
    try {
      const findToken = await TokenModel.findOne({ userId });
      return findToken;
    } catch (error) {
      throw error;
    }
  },
  getByToken: async (refreshToken: string) => {
    try {
      const findToken = await TokenModel.findOne({ token: refreshToken });
      return findToken;
    } catch (error) {
      throw error;
    }
  },
  create: async (token: TToken) => {
    try {
      const createToken = new TokenModel(token);
      const newToken = await createToken.save();
      return newToken;
    } catch (error) {
      throw error;
    }
  },
  update: async (userId: Types.ObjectId, token: string) => {
    try {
      const updatedToken = await TokenModel.findOneAndUpdate(
        { userId },
        { token }
      );
      return updatedToken;
    } catch (error) {
      throw error;
    }
  },
  delete: async (token: string) => {
    try {
      const result = await TokenModel.findOneAndDelete({ token });
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default TokenRepositories;
