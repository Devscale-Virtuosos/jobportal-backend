import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createError, env } from "../utils";
import { TokenRepositories } from "../repositories";
import { TTokenPayload } from "../types";

export async function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken, refreshToken } = req.cookies;

  // check if access token exists
  if (!accessToken) {
    next(createError(401, "access token not provided"));
    return;
  }

  try {
    jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
    next();
  } catch (_) {
    // access token invalid -> generate new one

    try {
      // check if refresh token exists
      if (!refreshToken) {
        throw createError(401, "Please re-login...");
      }

      // check if refresh token valid
      jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

      // IF refresh token valid THEN check if exists in database
      const activeRefreshToken = await TokenRepositories.getByToken(
        refreshToken
      );

      if (!activeRefreshToken) {
        throw createError(401, "Please re-login...");
      }

      const payload = jwt.decode(refreshToken) as TTokenPayload;

      // generate new access token
      const newAccessToken = jwt.sign(
        {
          id: payload?.id,
          name: payload?.name,
          email: payload?.email,
          picture: payload?.picture,
          role: payload?.role,
        },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: env.ACCESS_TOKEN_EXPIRES_TIME }
      );

      res.cookie("accessToken", newAccessToken);
      next();
    } catch (error) {
      next(error);
    }
  }
}
