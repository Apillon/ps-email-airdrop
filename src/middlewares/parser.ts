import * as bodyParser from 'body-parser';
import { Application, RequestHandler } from 'express';

/**
 * Applies data parser middlewares to application.
 * @param app ExpressJS application.
 */
export function inject(app: Application): void {
  app.use(createJsonParser());
}

/**
 * Returns JSON body parser middleware.
 */
export function createJsonParser(): RequestHandler {
  return bodyParser.json({ limit: '10mb' });
}
