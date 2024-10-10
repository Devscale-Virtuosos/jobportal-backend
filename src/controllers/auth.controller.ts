import type { NextFunction, Request, Response } from "express";
import { AuthServices } from "../services";
import { createError, env } from "../utils";
import { TTokenPayload } from "../types";

const AuthControllers = {
  handleRegister: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.params;

      const { authorizationURL, codeVerifier } =
        await AuthServices.generateGoogleAuthorization();

      res
        .cookie("codeVerifier", codeVerifier)
        .cookie("role", role)
        .redirect(authorizationURL);
    } catch (error) {
      next(error);
    }
  },
  handleLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorizationURL, codeVerifier } =
        await AuthServices.generateGoogleAuthorization();

      res.cookie("codeVerifier", codeVerifier).redirect(authorizationURL);
    } catch (error) {
      next(error);
    }
  },
  handleGoogleCallback: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // get from URL
    const code = req.query.code as string;

    // get from Cookies
    const { codeVerifier, role } = req.cookies;

    try {
      let accessToken = "";
      let refreshToken = "";
      let payload: TTokenPayload = null;

      if (role) {
        // register
        const {
          accessToken: _accessToken,
          refreshToken: _refresToken,
          tokenPayload,
        } = await AuthServices.register(code, codeVerifier, role);

        accessToken = _accessToken;
        refreshToken = _refresToken;
        payload = tokenPayload;
      } else {
        // login
        const {
          accessToken: _accessToken,
          refreshToken: _refresToken,
          tokenPayload,
        } = await AuthServices.login(code, codeVerifier);

        accessToken = _accessToken;
        refreshToken = _refresToken;
        payload = tokenPayload;
      }

      res
        .cookie("refreshToken", refreshToken, { httpOnly: true })
        .cookie("accessToken", accessToken)
        .cookie("user", JSON.stringify(payload))
        .clearCookie("codeVerifier")
        .clearCookie("role")
        .status(200)
        .redirect(env.CLIENT_AUTH_SUCCESS_REDIRECT_URL);
    } catch (error: any) {
      res
        .clearCookie("codeVerifier")
        .clearCookie("role")
        .redirect(
          `${env.CLIENT_URL}${
            role ? "/register" : "/login"
          }?error=true&message=${error.message}`
        );
    }
  },
  handleLogout: async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    try {
      // delete refresh token from database
      const result = await AuthServices.delete(refreshToken);

      // if (!result) {
      //   throw createError(400, "Failed to delete refresh token");
      // }

      res
        .clearCookie("refreshToken")
        .clearCookie("accessToken")
        .clearCookie("user")
        .json({ message: "Logout success!" });
    } catch (error) {
      next(error);
    }
  },
};

export default AuthControllers;
