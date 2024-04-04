import { env } from "../../config/env";
import { MySql, HttpServer } from "../../index";
import { Context } from "../../context";
import * as express from "express";

export interface Stage {
  context: Context;
  server: HttpServer;
  app: express.Application;
}

export async function createContextAndStartServer(
  overrideEnv?: any
): Promise<Stage> {
  let useEnv = env;
  if (overrideEnv) {
    useEnv = { ...env, ...overrideEnv };
  }
  useEnv.APP_ENV = "testing";
  const mysql = new MySql(useEnv);
  const api = new HttpServer({ env: useEnv, mysql });
  try {
    await mysql.connect();
    await api.listen();
    console.log(`Running server on ${useEnv.API_HOST}:${useEnv.API_PORT}`);

    // ensure running tests on test database
    // const databaseName = await mysql.paramQuery('SELECT DATABASE() as DB').then(res => res[0].DB);
    // tslint:disable-next-line: comment-type
    if (
      useEnv.APP_ENV !== "testing" ||
      !useEnv.MYSQL_DB_TEST ||
      !useEnv.MYSQL_DB_TEST.endsWith(
        "test"
      ) /*|| !databaseName.endsWith('test')*/
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

  return { context: new Context(useEnv, mysql), server: api, app: api.app };
}

export async function stopServerAndCloseMySqlContext(stage: Stage) {
  await stage.server.close();
  await stage.context.mysql.close();
}
