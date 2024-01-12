import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import { AuthenticateAdmin } from "../middlewares/authentication";
import { User } from "../models/user";

/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.get(
    "/users/statistics",
    AuthenticateAdmin,
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    }
  );
}

/**
 * A middleware that responds with server information.
 * @param req ExpressJS request object.
 * @param res ExpressJS response object.
 */
// @ts-ignore
export async function resolve(req: Request, res: Response): Promise<void> {
  const { context } = req;
  const user = new User({}, context);
  const statistics = await user.getStatistics();

  return res.respond(200, statistics);
}
