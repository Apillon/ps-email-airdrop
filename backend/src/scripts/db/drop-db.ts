import * as readline from 'readline';
import { env } from '../../config/env';
import { clearDatabase } from '../../lib/migrations';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const run = async () => {
  await clearDatabase();
};

rl.question(
  `You are about to run all downgrade scripts for ${env.MYSQL_DB} @ ${env.MYSQL_HOST}.\n Are you sure? (Yes/No):`,
  (answer) => {
    if (answer.toLowerCase() === 'yes') {
      console.log(`Downgrading ...`);
    } else {
      console.log(`Exiting.`);
      process.exit(0);
    }

    rl.close();

    run()
      .then(() => {
        console.log('Complete!');
        process.exit(0);
      })
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  },
);
