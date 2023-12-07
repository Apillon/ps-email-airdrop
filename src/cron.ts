import { CronJob } from "cron";
import { MySql } from "./lib/mysql";
import { AirdropStatus, User } from "./models/user";
import { dateToSqlString } from "./lib/sql-utils";
import { SqlModelStatus } from "./models/base-sql-model";
import { MysqlConnectionManager } from "./lib/mysql-connection-manager";

export class Cron {
  private cronJobs: CronJob[] = [];

  constructor() {
    this.cronJobs.push(new CronJob("* * * * *", this.sendEmail, null, false));
    this.cronJobs.push(new CronJob("* * * * *", this.airdrop, null, false));
  }

  async start() {
    for (const cronJob of this.cronJobs) {
      cronJob.start();
    }
  }

  async stop() {
    for (const cronJob of this.cronJobs) {
      cronJob.stop();
    }
    await MysqlConnectionManager.destroyInstance();
  }

  async sendEmail() {
    const mysql = await MysqlConnectionManager.getInstance();
    const conn = await mysql.start();
    await conn.beginTransaction();

    try {
      const res = await conn.execute(
        `SELECT * FROM user WHERE
          airdrop_status = ${AirdropStatus.PENDING}
          AND status = ${SqlModelStatus.ACTIVE}
          AND email_start_send_time < '${dateToSqlString(new Date())}'
          FOR UPDATE
        ;
       `
      );
      const users = res[0] as Array<any>;
      if (users.length > 0) {
        console.log(users);
      }

      await conn.commit();
    } catch (e) {
      console.log(e);
      await conn.rollback();
    }
  }

  private async airdrop() {
    console.log("test");
  }
}
