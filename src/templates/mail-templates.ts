import * as fs from "fs";
import * as path from "path";
import * as handlebars from "handlebars";
import { LogType, writeLog } from "../lib/logger";

export class MailTemplates {
  /**
   * Cached compiled handlebars template collection
   */
  public static templates: Object = {};

  private static TEMPLATE_DIR = `${__dirname}/mail`;

  /**
   * Returns compiled mail template. If its not cahced in collection it is read from file system.
   * @param templateName name of template
   * @returns compiled mail template
   */
  public static getTemplate(templateName: string) {
    if (!this.templates.hasOwnProperty(templateName)) {
      try {
        const html = fs.readFileSync(
          `${this.TEMPLATE_DIR}/${templateName}.html`,
          "utf8"
        );
        this.templates[templateName] = handlebars.compile(html);
      } catch (err) {
        writeLog(
          LogType.ERROR,
          path.resolve(`./mail/${templateName}.html`),
          "mail-templates.ts",
          "getTemplate"
        );
        writeLog(LogType.ERROR, err, "mail-templates.ts", "getTemplate");
        return null;
      }
    }
    return this.templates[templateName];
  }
}
