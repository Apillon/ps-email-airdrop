import { Application } from 'express';
import { NextFunction, Request, Response } from '../http';
import { RouteErrorCode, SerializedStrategy } from '../config/values';
import { AuthenticateAdmin } from '../middlewares/authentication';
import { ResourceError, ValidationError } from '../lib/errors';
import { User } from '../models/user';

/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.get(
    '/users',
    AuthenticateAdmin,
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    },
  );
  app.get(
    '/users/:userId',
    AuthenticateAdmin,
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    },
  );
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { context, params, query } = req;

  if (!params || !params.userId) {
    return res.respond(200, await new User({}, context).getList(query));
  } else if (parseInt(params.articleId)) {
    const user = await new User({}, context).populateById(
      parseInt(params.userId),
    );
    return res.respond(200, user.serialize(SerializedStrategy.ADMIN));
  } else {
    throw new ResourceError(
      RouteErrorCode.INVALID_REQUEST,
      context,
      'get-users',
    );
  }
}
