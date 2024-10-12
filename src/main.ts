import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import { errorHandlerMiddleware } from "./middlewares";
import {
  applicantRouter,
  applicationRouter,
  authRouter,
  companyRouter,
  jobRouter,
  userRouter,
} from "./routes";
import { connectMongodb, env } from "./utils";

connectMongodb();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("common")); // to log http request
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

/**
 * Routes
 */

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/applicants", applicantRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/users", userRouter);

// error handler middleware, place it after all routes
app.use(errorHandlerMiddleware);

app.listen(env.PORT || 8080, () => {
  console.log(`Server running at port: ${env.PORT || 8080}`);
});
