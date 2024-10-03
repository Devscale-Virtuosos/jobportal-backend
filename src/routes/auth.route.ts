import express from "express";
import { AuthControllers } from "../controllers";

export const authRouter = express.Router();

authRouter.post("/register/:role", AuthControllers.handleRegister);
authRouter.post("/login", AuthControllers.handleLogin);
authRouter.get("/google/callback", AuthControllers.handleGoogleCallback);
authRouter.post("/logout", AuthControllers.handleLogout);
