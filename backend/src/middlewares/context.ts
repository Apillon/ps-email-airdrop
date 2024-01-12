import { Application, RequestHandler } from "express";
import { IEnv } from "../config/env";
import { Context } from "../context";
import { NextFunction, Request, Response } from "../http";
import { MySql } from "../lib/mysql";

/**
 * Applies context middleware to application.
 */
export function inject(app: Application, env: IEnv, mysql: MySql): void {
  app.use(createContext(env, mysql));
}

/**
 * Returns a middleware which creates a new context object for each request and
 * saves it to the request object.
 */
export function createContext(env: IEnv, mysql: MySql): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    req.context = new Context(env, mysql);

    // authenticating is done with authentication middleware

    next();
  };
}
