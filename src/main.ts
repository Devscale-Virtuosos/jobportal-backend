import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandlerMiddleware } from "./middlewares";
import {
  applicantRouter,
  authRouter,
  companyRouter,
  jobRouter,
  userRouter,
} from "./routes";
import { connectMongodb, env } from "./utils";

connectMongodb();

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("common")); // to log http request

/**
 * Routes
 */

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/applicants", applicantRouter); // Applicant routes
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/users", userRouter);

// error handler middleware, place it after all routes
app.use(errorHandlerMiddleware);

app.listen(env.PORT || 8080, () => {
  console.log(`Server running at port: ${env.PORT || 8080}`);
});
