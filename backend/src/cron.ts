import { CronJob } from 'cron';
import { AirdropStatus } from './models/user';
import { dateToSqlString } from './lib/sql-utils';
import { SqlModelStatus } from './models/base-sql-model';
import { MysqlConnectionManager } from './lib/mysql-connection-manager';
import { SmtpSendTemplate } from './lib/node-mailer';
import { env } from './config/env';
import { generateEmailAirdropToken } from './lib/jwt';
import { LogType, writeLog } from './lib/logger';

export class Cron {
  private cronJobs: CronJob[] = [];

  constructor() {
    this.cronJobs.push(new CronJob('* * * * *', this.sendEmail, null, false));
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

    try {
      const res = await conn.execute(
        `SELECT * FROM user WHERE
          airdrop_status = ${AirdropStatus.PENDING}
          AND status = ${SqlModelStatus.ACTIVE}
          AND email_start_send_time < '${dateToSqlString(new Date())}'
          FOR UPDATE
        ;
       `,
      );
      const users = res[0] as Array<any>;

      const updates = [];

      for (let i = 0; i < users.length; i++) {
        try {
          const token = await generateEmailAirdropToken(users[i].email);
          await SmtpSendTemplate(
            [users[i].email],
            'Claim your NFT',
            'en-airdrop-claim',
            {
              link: `${env.APP_URL}/claim?token=${token}`,
            },
          );
          updates.push(
            `(${users[i].id}, '${users[i].email}', ${AirdropStatus.EMAIL_SENT}, '${dateToSqlString(
              new Date(),
            )}')`,
          );
        } catch (e) {
          writeLog(LogType.ERROR, e, 'cron.ts', 'sendEmail');
          updates.push(
            `(${users[i].id}, '${users[i].email}', ${AirdropStatus.EMAIL_ERROR}, '${dateToSqlString(
              new Date(),
            )}')`,
          );
        }
      }

      if (updates && updates.length > 0) {
        const sql = `
        INSERT INTO user (id, email, airdrop_status, email_sent_time)
        VALUES ${updates.join(',')}
        ON DUPLICATE KEY UPDATE
        airdrop_status = VALUES(airdrop_status),
        email_sent_time = VALUES(email_sent_time)`;

        await conn.execute(sql);
      }
      await conn.commit();
    } catch (e) {
      writeLog(LogType.ERROR, e, 'cron.ts', 'sendEmail');
      await conn.rollback();
    }
    MysqlConnectionManager.destroyInstance();
  }
}
