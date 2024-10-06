import { generateCodeVerifier, generateState } from "arctic";
import jwt from "jsonwebtoken";
import { ROLE } from "../constants";
import {
  CompanyRepositories,
  TokenRepositories,
  UserRepositories,
} from "../repositories";
import { IGoogleUserInfo } from "../types";
import { createError, env, google } from "../utils";

const AuthServices = {
  generateGoogleAuthorization: async () => {
    try {
      // generate 2 code challenges
      const state = generateState();
      const codeVerifier = generateCodeVerifier();

      // generate authorizationURL
      const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email"],
      });

      return { authorizationURL: url.href, codeVerifier };
    } catch (error) {
      throw error;
    }
  },
  register: async (code: string, codeVerifier: string, role: string) => {
    try {
      // check
      if (!code || !codeVerifier) {
        throw createError(500, "Failed authorize with Google");
      }

      const tokens = await google.validateAuthorizationCode(code, codeVerifier);

      // get user info
      const response = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      const user: IGoogleUserInfo = await response.json();

      // check if user exists
      const findUser = await UserRepositories.getByEmail(user.email);

      if (findUser) {
        // user exists
        throw createError(400, `User with email ${user.email} already exists.`);
      }

      // user not found in database then create new one
      const newUser = await UserRepositories.create({
        name: user.name,
        email: user.email,
        picture: user.picture,
        role,
      });

      // if register as recruiter then create initial company details
      if (role === ROLE.RECRUITER) {
        await CompanyRepositories.create({
          userId: newUser._id,
          name: `${newUser.name}'s Company`,
          location: "-",
          industry: "-",
          description: "-",
          logo: "",
        });
      }

      // generate Session ID
      const tokenPayload = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        role: newUser.role,
      };

      const accessToken = jwt.sign(tokenPayload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_TIME,
      });
      const refreshToken = jwt.sign(tokenPayload, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_TIME,
      });

      // check if token exists in database
      const findToken = await TokenRepositories.getByUserId(tokenPayload.id);
      if (findToken) {
        await TokenRepositories.update(tokenPayload.id, refreshToken);
      } else {
        await TokenRepositories.create({
          userId: tokenPayload.id,
          token: refreshToken,
        });
      }

      return { accessToken, refreshToken, tokenPayload };
    } catch (error) {
      throw error;
    }
  },
  login: async (code: string, codeVerifier: string) => {
    try {
      // check
      if (!code || !codeVerifier) {
        throw createError(500, "Failed authorize with Google");
      }

      const tokens = await google.validateAuthorizationCode(code, codeVerifier);

      // get user info
      const response = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      const user: IGoogleUserInfo = await response.json();

      /* Login Strategy */
      // check if user exists
      const findUser = await UserRepositories.getByEmail(user.email);

      if (!findUser) {
        // user not exists
        throw createError(400, `User with email ${user.email} not exists.`);
      }

      const tokenPayload = {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        picture: findUser.picture,
        role: findUser.role,
      };

      const accessToken = jwt.sign(tokenPayload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_TIME,
      });
      const refreshToken = jwt.sign(tokenPayload, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_TIME,
      });

      // check if token exists in database
      const findToken = await TokenRepositories.getByUserId(tokenPayload.id);
      if (findToken) {
        await TokenRepositories.update(tokenPayload.id, refreshToken);
      } else {
        await TokenRepositories.create({
          userId: tokenPayload.id,
          token: refreshToken,
        });
      }

      return { accessToken, refreshToken, tokenPayload };
    } catch (error) {
      throw error;
    }
  },
  delete: async (refreshToken: string) => {
    try {
      const result = await TokenRepositories.delete(refreshToken);
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default AuthServices;
