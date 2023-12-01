import { Application, RequestHandler } from 'express';
import { NextFunction, Request, Response } from '../http';

/**
 * Applies a middleware with helper methods to application.
 * @param app ExpressJS application.
 */
export function inject(app: Application): void {
  app.use(createRespond());
  app.use(createThrow());
}

/**
 * Returns a middleware which adds `respond()` method to the response object.
 */
export function createRespond(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    res.respond = (status: number, data: Object, meta?: Object) => {
      res.status(status).json({
        'data': data,
        'id': req.context.id,
        'meta': meta,
        'status': status
      });
    };
    next();
  };
}

/**
 * Returns a middleware which adds `throw()` method to the response object.
 */
export function createThrow(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    res.throw = (status: number, errors: any) => {
      res.status(status).json({
        'errors': (Array.isArray(errors) ? errors : [errors]).map((error) => ({
          'code': error.code,
          'message': error.message
        })),
        'id': req.context.id,
        'status': status
      });
    };
    next();
  };
}
