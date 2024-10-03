import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandlerMiddleware } from "./middlewares";
import { applicantRouter, authRouter, jobRouter } from "./routes";
import { connectMongodb, env } from "./utils";

connectMongodb();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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

// error handler middleware, place it after all routes
app.use(errorHandlerMiddleware);

app.listen(env.PORT || 8080, () => {
  console.log(`Server running at port: ${env.PORT || 8080}`);
});
