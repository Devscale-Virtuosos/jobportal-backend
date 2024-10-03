import { TUser, UserModel } from "./models";

const UserRepositories = {
  getByEmail: async (email: string) => {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  },
  create: async (user: TUser) => {
    try {
      const createUser = new UserModel(user);
      const newUser = await createUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
  },
};

export default UserRepositories;
