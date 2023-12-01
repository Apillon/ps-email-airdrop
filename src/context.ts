import { IEnv } from "./config/env";
import { MySql } from "./lib/mysql";

/**
 * Request object context holds personalized request-based information.
 */
export class Context {
  public id: number;
  public env: IEnv;
  public mysql: MySql;

  /**
   * Class constructor.
   */
  public constructor(env: IEnv, mysql: MySql) {
    this.id = 0;
    this.env = env;
    this.mysql = mysql;
  }
}
