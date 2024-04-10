import { Migration, MigrationConnection } from 'ts-mysql-migrate';
import { ConnectionOptions, createPool } from 'mysql2';

let dbMigration: Migration = null;

export async function setupDatabase() {
  if (!dbMigration) {
    await initMigrations();
  }
  await dbMigration.up();
}

export async function upgradeDatabase(steps?: number) {
  if (!dbMigration) {
    await initMigrations();
  }
  await dbMigration.up(steps);
}

export async function downgradeDatabase(steps?: number) {
  if (!dbMigration) {
    await initMigrations();
  }
  await dbMigration.down(steps);
}

export async function clearDatabase() {
  if (!dbMigration) {
    await initMigrations();
  }

  await dbMigration.reset();
}

export async function rebuildDatabase() {
  if (!dbMigration) {
    await initMigrations();
  }

  await dbMigration.reset();
}

export async function dropDatabase() {
  if (!dbMigration) {
    await initMigrations();
  }
  await dbMigration.down(-1);
}

async function initMigrations() {
  const poolConfig: ConnectionOptions = {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    // debug: true,
    connectionLimit: 1,
  };

  const pool = createPool(poolConfig);

  dbMigration = new Migration({
    conn: pool as unknown as MigrationConnection,
    tableName: 'migrations',
    dir: `./src/migrations/`,
  });

  await dbMigration.initialize();
}
