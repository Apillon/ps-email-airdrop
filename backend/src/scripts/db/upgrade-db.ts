import * as readline from 'readline';
import { env } from '../../config/env';
import { upgradeDatabase } from '../../lib/migrations';
import { bgYellow, black } from 'colors/safe';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let steps = 0;

const run = async () => {
  await upgradeDatabase(steps);
};

rl.question(`You are about to upgrade database ${bgYellow(black(` ${env.MYSQL_DB} @ ${env.MYSQL_HOST} `))}.

Set number of versions to upgrade ('Y' for all, '<number>' for number of versions, 'N' to exit):`, (answer) => {

  steps = parseInt(answer);
  if (answer.toUpperCase() === 'Y') {
    steps = 0;
    console.log(`Upgrading to LATEST version.`);
  } else if (steps) {
    console.log(`Upgrading for ${steps} version(s).`);
  } else {
    console.log(`Invalid input. Exiting.`);
    process.exit(0);
  }

  rl.close();

  run().then(() => {
    console.log('Complete!');
    process.exit(0);
  }).catch((err) => {
    console.log(err);
    process.exit(1);
  });

});
