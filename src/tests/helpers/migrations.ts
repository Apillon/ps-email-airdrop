import { Migration, MigrationConnection } from "ts-mysql-migrate";
import { env } from "../../config/env";
import { ConnectionOptions, createPool } from "mysql2";

let seedMigration: Migration = null;
let testDbMigration: Migration = null;

export async function setupTestDatabase() {
  if (!testDbMigration || !seedMigration) {
    await initMigrations();
  }
  await testDbMigration.reset();
  await seedMigration.reset();
}

export async function seedTestDatabase() {
  if (!seedMigration) {
    await initMigrations();
  }
  await seedMigration.reset();
}

export async function clearTestDatabase() {
  // await initMigrations();
  if (!testDbMigration || !seedMigration) {
    await initMigrations();
  }
  await seedMigration.down(-1);
  await testDbMigration.down(-1);
}

export async function rebuildTestDatabase() {
  // await initMigrations();
  if (!testDbMigration || !seedMigration) {
    await initMigrations();
  }
  try {
    await seedMigration.down(-1);
  } catch (err) {
    console.log(err);
  }
  await testDbMigration.reset();
  await seedMigration.up();
}

export async function dropTestDatabase() {
  // await initMigrations();
  if (!testDbMigration) {
    await initMigrations();
  }
  await testDbMigration.down(-1);
}

async function initMigrations() {
  env.APP_ENV = "testing";
  const poolConfig: ConnectionOptions = {
    host: process.env.MYSQL_HOST_TEST,
    port: parseInt(process.env.MYSQL_PORT_TEST),
    user: process.env.MYSQL_USER_TEST,
    password: process.env.MYSQL_PASSWORD_TEST,
    database: process.env.MYSQL_DB_TEST,
    // debug: true,
    connectionLimit: 1,
  };

  const pool = createPool(poolConfig);

  seedMigration = new Migration({
    conn: pool as unknown as MigrationConnection,
    tableName: "seeds",
    dir: `./src/tests/seed/`,
    silent: true,
  });

  testDbMigration = new Migration({
    conn: pool as unknown as MigrationConnection,
    tableName: "migrations",
    dir: `./src/migrations/`,
    silent: true,
  });

  await seedMigration.initialize();
  await testDbMigration.initialize();
}
