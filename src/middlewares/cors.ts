import * as cors from 'cors';
import { Application, RequestHandler } from 'express';

/**
 * Applies CORS middleware to application.
 * @param app ExpressJS application.
 */
export function inject(app: Application): void {
  app.use(createAllowWhitelist());
}

/**
 * Returns a middleware for handling cross-origin resource sharing permissions.
 */
export function createAllowWhitelist(): RequestHandler {
  return cors();
}
