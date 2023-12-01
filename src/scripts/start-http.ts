import { HttpServer, MySql } from "..";
import { env } from "../config/env";
import { writeLog, LogType } from "../lib/logger";

const mysql = new MySql(env);
const api = new HttpServer({ env, mysql });

(async () => {
  await mysql.connect();
  await api.listen();
  writeLog(
    LogType.INFO,
    `Running server on ${env.API_HOST}:${env.API_PORT}`,
    "start-http.ts",
    ""
  );
})().catch(async (err) => {
  writeLog(
    LogType.INFO,
    "Error during context creation and server run",
    "start-http.ts",
    "",
    err
  );
  await api.close();
  await mysql.close();
});
