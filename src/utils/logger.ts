import { createLogger, transports, format } from "winston";
import rTracer from "cls-rtracer";

const logFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.printf((info) => {
    const traceId = rTracer.id();
    if (info.level.includes("error")) {
      return traceId
        ? `[${info.timestamp}] ${info.level}: [${traceId}] ${info.message} ${info.stack}`
        : `[${info.timestamp}] ${info.level}: ${info.message} ${info.stack}`;
    }
    return traceId
      ? `[${info.timestamp}] ${info.level}: [${traceId}] ${info.message}`
      : `[${info.timestamp}] ${info.level}: ${info.message}`;
  }),
);

export default createLogger({
  transports: [
    new transports.Console({
      level:
        process.env.DEBUG_MODE?.toLowerCase() === "true" ? "verbose" : "http",
      handleRejections: true,
      handleExceptions: true,
    }),
  ],
  format: logFormat,
});
