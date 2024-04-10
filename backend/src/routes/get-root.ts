import { Application } from 'express';
import { NextFunction, Request, Response } from '../http';
import { env } from '../config/env';

/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    resolve(req, res).catch(next);
  });
  app.get('/health', (req: Request, res: Response, next: NextFunction) => {
    resolve(req, res).catch(next);
  });
}

/**
 * A middleware that responds with server information.
 * @param req ExpressJS request object.
 * @param res ExpressJS response object.
 */
// @ts-ignore
export async function resolve(req: Request, res: Response): Promise<void> {
  // writeLog(LogType.ERROR, "Test ERROR!");
  // writeLog(LogType.INFO, "Test INFO!");
  // writeLog(LogType.MESSAGE, "Test MESSAGE!");
  // writeLog(LogType.SQL, "Test SQL!");

  return res.respond(200, {
    name: 'email-airdrop',
    database: req.context.mysql.db ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    version: process.env.npm_package_version,
    env: env.APP_ENV,
  });
}
