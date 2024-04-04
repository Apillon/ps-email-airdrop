import { IEnv } from "./config/env";
import { readAdminAuthToken } from "./lib/jwt";
import { MySql } from "./lib/mysql";

/**
 * Request object context holds personalized request-based information.
 */
export class Context {
  public id: number;
  public env: IEnv;
  public mysql: MySql;
  public isAdmin: boolean;

  /**
   * Class constructor.
   */
  public constructor(env: IEnv, mysql: MySql) {
    this.id = 0;
    this.env = env;
    this.mysql = mysql;
    this.isAdmin = false;
  }

  /**
   * Authenticates a profile from authentication token.
   * @param req ExpressJS request object.
   */
  public async authenticateAdmin(token: string) {
    const data = await readAdminAuthToken(token);
    if (data && data.wallet) {
      this.isAdmin = true;
      return this;
    }

    return this;
  }
}
