import { Cron } from '..';
import { writeLog, LogType } from '../lib/logger';

const cron = new Cron();

(async () => {
  await cron.start();
  writeLog(LogType.INFO, `Running cron`, 'start-cron.ts', '');
})().catch(async (err) => {
  writeLog(LogType.INFO, 'Error during cron run', 'start-cron.ts', '', err);
  cron.stop();
});
