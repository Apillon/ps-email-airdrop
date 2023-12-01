import { Application } from "express";
import messages from "../config/messages";
import { SystemErrorCode } from "../config/values";
import { NextFunction, Request, Response } from "../http";
import {
  ResourceError,
  UnauthenticatedError,
  UnauthorizedError,
  ValidationError,
  ProcedureError,
  GenericError,
  SqlError,
  SystemError,
} from "../lib/errors";

/**
 * Applies error-related routes to application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.use(handleNotFound);
  app.use(handleError);
}

/**
 * A middleware which handles 404.
 * @param req ExpressJS request object.
 * @param res ExpressJS response object.
 */
// @ts-ignore
export function handleNotFound(req: Request, res: Response): void {
  res.throw(404, {
    code: 50033,
    message: messages(50033),
  });
}

/**
 * A middleware which handles system errors.
 * @param error Error object.
 * @param req ExpressJS request object.
 * @param res ExpressJS response object.
 * @param next ExpressJS next function.
 */
// @ts-ignore
export function handleError(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (
    error instanceof UnauthenticatedError ||
    error instanceof UnauthorizedError ||
    error instanceof ResourceError ||
    error instanceof ProcedureError ||
    error instanceof GenericError ||
    error instanceof SqlError ||
    error instanceof SystemError
  ) {
    res.throw(error.status, {
      code: error.code,
      message: error.message,
    });
  } else if (error instanceof ValidationError) {
    res.throw(
      error.status,
      error.model.collectErrors().map((e) => ({
        code: e.code,
        message: messages(e.code),
        path: e.path,
      }))
    );
  } else {
    res.throw(500, {
      code: error.code || SystemErrorCode.UNHANDLED_SYSTEM_ERROR, // expose only error code
      message: messages(SystemErrorCode.UNHANDLED_SYSTEM_ERROR), // don't expose message to users
    });
    console.error("Error:", error);
  }

  next();
}
