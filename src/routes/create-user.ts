import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import { DefaultUserRoles } from "../config/values";
import { AuthenticateAdmin } from "../middlewares/authentication";

/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.post(
    "/users",
    AuthenticateAdmin,
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    }
  );
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { context, body } = req;
}
