import { env } from "../../config/env";
import { MySql, HttpServer } from "../../index";
import { Context } from "../../context";
import * as express from "express";

export interface Stage {
  context: Context;
  server: HttpServer;
  app: express.Application;
}

export async function createContextAndStartServer(): Promise<Stage> {
  env.APP_ENV = "testing";
  const mysql = new MySql(env);
  const api = new HttpServer({ env, mysql });
  try {
    await mysql.connect();
    await api.listen();
    console.log(`Running server on ${env.API_HOST}:${env.API_PORT}`);

    // ensure running tests on test database
    // const databaseName = await mysql.paramQuery('SELECT DATABASE() as DB').then(res => res[0].DB);
    // tslint:disable-next-line: comment-type
    if (
      env.APP_ENV !== "testing" ||
      !env.MYSQL_DB_TEST ||
      !env.MYSQL_DB_TEST.endsWith("test") /*|| !databaseName.endsWith('test')*/
    ) {
      console.error(
        "NOT ON TESTING DATABASE, EXITING (if you are sure, comment this check out)"
      );
      throw new Error("NOT ON TESTING DATABASE!");
    }
  } catch (err) {
    console.log("Error during context creation and server run", err);
    await api.close();
    await mysql.close();
    process.exit(1);
  }

  return { context: new Context(env, mysql), server: api, app: api.app };
}

export async function stopServerAndCloseMySqlContext(stage: Stage) {
  await stage.server.close();
  await stage.context.mysql.close();
}
