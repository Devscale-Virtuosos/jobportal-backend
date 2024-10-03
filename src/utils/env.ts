import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: port(),
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_REDIRECT_URL: str(),
  MONGO_URI: str(),
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_SECRET: str(),
  ACCESS_TOKEN_EXPIRES_TIME: str(),
  REFRESH_TOKEN_EXPIRES_TIME: str(),
  CLIENT_AUTH_SUCCESS_REDIRECT_URL: str(),
  CLIENT_AUTH_FAILED_REDIRECT_URL: str(),
});
