import express, {
  urlencoded,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import { RegisterRoutes } from "../build/routes";
import swaggerUi from "swagger-ui-express";
import path from "path";
import ErrorHandler from "./middlewares/error.middleware";
import config from "./config/envVariables";
import logger from "./utils/logger";
import dbConnect from "./config/db";
export const app = express();
import { Server } from "http";
import mongoose from "mongoose";
import initializeCronJobs from "./config/cron";
// import { expressAuthentication } from "./middlewares/auth-passport.middleware";
import passport from "passport";
import morgan from "morgan";

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  }),
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Custom-Header, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});
app.use(morgan("common"));

app.use(express.json());
app.use(passport.initialize());
if (config.NODE_ENV !== "PROD") {
  app.use(
    "/docs",
    swaggerUi.serve,
    async (_req: ExRequest, res: ExResponse): Promise<void> => {
      const swaggerDocument = await import(
        path.resolve(__dirname, "../build/swagger.json")
      );
      res.send(swaggerUi.generateHTML(swaggerDocument));
    },
  );
}

// app.use(expressAuthentication);
RegisterRoutes(app);

app.use(
  (
    err: Error & { status?: number },
    req: ExRequest,
    res: ExResponse,
    next: NextFunction,
  ) => {
    ErrorHandler(err, req, res, next);
  },
);

let startedServer: Server | null = null;
const server = app.listen(config.APP_PORT, () => {
  dbConnect()
    .then(() => {
      logger.info(`⚡️[server]: HBS Server is running at ${config.APP_PORT}`);
      startedServer = server;
    })
    .catch((e) => logger.error(e));
});
const mongooseExit = () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose connection is disconnected due to application termination",
    );
    process.exit(0);
  });
};
initializeCronJobs();
const stopServer = async () => {
  if (startedServer?.listening) {
    logger.info("Attempting to stop Express server");

    await new Promise<void>(
      (resolve) =>
        startedServer &&
        startedServer.close((error) => {
          if (error === undefined) {
            logger.info("Successfully stopped Express server");
          } else {
            logger.error("Error stopping Express server", error.stack);
          }
          startedServer = null;
          resolve();
        }),
    );
  }
  mongooseExit();
};
["exit", "SIGINT", "SIGTERM", "SIGUSR1", "SIGUSR2"].forEach((event) => {
  process.on(event, stopServer);
});
