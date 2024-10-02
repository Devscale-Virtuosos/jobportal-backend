import express from "express";
import morgan from "morgan";
import { errorHandlerMiddleware } from "./middlewares";
import { env } from "./utils";
import { jobRouter } from "./routes";
import { connectDB } from "./utils/db";
import jobListRoute from "./routes/job.list.route";
import applicantRoute from "./routes/applicant.list.route";

const app = express();

app.use(express.json());
app.use(morgan("common")); // to log http request
connectDB();

/**
 * Routes
 */
// app.use("/api/v1/jobs", jobRouter);

app.use("/api/v1/jobs", jobListRoute);
app.use("/api/v1/applicants", applicantRoute); // Applicant routes

// error handler middleware, place it after all routes
app.use(errorHandlerMiddleware);

app.listen(env.PORT || 8080, () => {
  console.log(`Server running at port: ${env.PORT || 8080}`);
});
