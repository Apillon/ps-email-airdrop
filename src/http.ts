import * as express from "express";
import * as cors from "cors";
import { Server } from "http";
import { IEnv } from "./config/env";
import { Context } from "./context";
import { MySql } from "./lib/mysql";
import { inject as injectContext } from "./middlewares/context";
import { inject as injectCors } from "./middlewares/cors";
// import { inject as injectCompression } from './middlewares/compression';
import { inject as injectErrors } from "./middlewares/errors";
import { inject as injectDataParser } from "./middlewares/parser";
import { inject as injectRenders } from "./middlewares/renders";
import { inject as injectGetRoot } from "./routes/get-root";
import { inject as injectCreateUser } from "./routes/create-user";
import { inject as injectGetUser } from "./routes/get-user";
import { inject as injectClaimAidrop } from "./routes/claim-airdrop";
import { inject as injectAdminLogin } from "./routes/admin-login";

export interface Request extends express.Request {
  context: Context;
  body: { [key: string]: any };
}

/**
 * ExpressJS response object interface which includes middlewares features.
 */
export interface Response extends express.Response {
  respond(status: number, data: Object, meta?: Object): void;
  throw(status: number, errors: any): void;
}

/**
 * ExpressJS next function interface.
 */
export interface NextFunction extends express.NextFunction {}

/**
 * Http server config.
 */
export interface HttpServerConfig {
  env: IEnv;
  mysql: MySql;
}

/**
 * HTTP server exposes REST API.
 */
export class HttpServer {
  public config: HttpServerConfig;
  public app: express.Application;
  public server: Server;

  /**
   * Class constructor.
   * @param env Environment variables.
   * @param mongo Already connected mongodb.
   */
  public constructor(config: HttpServerConfig) {
    this.config = config;

    this.app = express();
    this.app.use(cors());
    // MIDDLEWARES
    injectRenders(this.app);
    // injectCompression(this.app);
    injectCors(this.app);
    injectContext(this.app, this.config.env, this.config.mysql);
    injectDataParser(this.app);

    // ROUTES
    injectGetRoot(this.app);
    injectCreateUser(this.app);
    injectGetUser(this.app);
    injectClaimAidrop(this.app);
    injectAdminLogin(this.app);

    // ERROR HANDLER
    injectErrors(this.app);
    // DO NOT INJECT ANYTHING AFTER INJECT ERRORS!
  }

  /**
   * Starts the server.
   * @param host Server hostname.
   * @param port Server listening port.
   */
  public async listen() {
    await new Promise((res) => {
      this.server = this.app.listen(
        this.config.env.API_PORT,
        this.config.env.API_HOST
      );
      res(null);
    });

    return this;
  }

  /**
   * Stops the server.
   */
  public async close() {
    await new Promise((resolve) => {
      this.server.close(resolve);
      this.server = null;
    });

    return this;
  }

  /**
   * Returns an array of all available routes.
   */
  public collectRoutes(): { method: string; path: string }[] {
    return this.app.router["stack"]
      .map((middleware) => middleware.route)
      .filter((route) => !!route)
      .map((route) =>
        Object.keys(route.methods).map((method) => ({
          method: method.toUpperCase(),
          path: route.path,
        }))
      )
      .reduce((a, b) => a.concat(b), [])
      .sort((a, b) =>
        `${a.path}@${a.method}`.localeCompare(`${b.path}@${b.method}`)
      );
  }
}
