import * as moment from "moment";
import { env } from "../config/env";
import {
  red,
  yellow,
  black,
  bgYellow,
  bgRed,
  bgGreen,
  green,
  bgBlack,
  gray,
  bgCyan,
  cyan,
} from "colors/safe";

export enum LogType {
  INFO = "INF",
  MESSAGE = "MSG",
  ERROR = "ERR",
  SQL = "SQL",
}

export function writeLog(
  type: LogType,
  message: any,
  fileSource = "",
  functionSource = "",
  error?: Error
) {
  if (env.LOG_TARGET == "console") {
    // setTheme({
    //   info: [bgYellow, black],
    //   message: [bgWhite, blue],
    //   error: [bgRed, black],
    //   sql: [bgBlack, green]
    // });
    let bgColor = bgBlack;
    let color = black;
    switch (type) {
      case LogType.INFO:
        bgColor = bgYellow;
        color = yellow;
        break;
      case LogType.MESSAGE:
        bgColor = bgCyan;
        color = cyan;
        break;
      case LogType.ERROR:
        bgColor = bgRed;
        color = red;
        break;
      case LogType.SQL:
        bgColor = bgGreen;
        color = green;
        break;
      default:
        bgColor = bgBlack;
        color = black;
    }
    console.log(
      bgColor(black(`[${type}]`)),
      gray(`[${moment().format("YYYY-MM-DD HH:mm:ss Z")}]:`),
      color(
        `${
          typeof message == "string"
            ? message
            : JSON.stringify(message, null, 2)
        }${message && error && error.message ? ", " : ""}${
          error ? `${error.message}` || "" : ""
        }`
      ),
      gray(`[${fileSource}/${functionSource}]`)
    );
  } else if (env.LOG_TARGET == "console_plain") {
    console.log(
      `[${type}][${moment().format("YYYY-MM-DD HH:mm:ss Z")}]:`,
      `${
        typeof message == "string" ? message : JSON.stringify(message, null, 2)
      }${message && error && error.message ? ", " : ""}${
        error ? `${error.message}` || "" : ""
      }`,
      `[${fileSource}/${functionSource}]`
    );
  } else if (env.LOG_TARGET == "minimal") {
    console.log("log", type, message);
  }
}
