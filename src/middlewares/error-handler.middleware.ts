import type { NextFunction, Request, Response } from "express";
import { env } from "../utils";

export function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { statusCode, message } = err;

  // statusCode only exists in custom error
  const errStatus = statusCode || 500;
  const errMessage = statusCode
    ? message
    : err?.message || "Something went wrong";
  const errStack = !statusCode ? err?.stack : {};

  if (errStatus === 401 || errStatus == 403) {
    res
      .clearCookie("refreshToken", { domain: env.DOMAIN })
      .clearCookie("accessToken", { domain: env.DOMAIN })
      .clearCookie("user", { domain: env.DOMAIN })
      .status(errStatus)
      .json({ message: errMessage, stack: errStack, data: null });
    return;
  }

  res
    .status(errStatus)
    .json({ message: errMessage, stack: errStack, data: null });
}
