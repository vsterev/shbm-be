import { Response, Request, NextFunction } from "express";
import { ValidateError } from "tsoa";

const errorHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err.status === 401) {
    console.warn(`Caught Authorization Error for ${req.path}:`, err.message);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
  next(err);
};
export default errorHandler;
