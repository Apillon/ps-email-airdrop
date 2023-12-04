export async function upgrade(
  queryFn: (query: string, values?: any[]) => Promise<Array<any>>
) {
  await queryFn(`
    CREATE TABLE IF NOT EXISTS \`user\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`email\` VARCHAR(255) NOT NULL,
      \`wallet\` VARCHAR(80) NULL,
      \`tx_hash\` VARCHAR(80) NULL DEFAULT NULL,
      \`status\` INT NULL,
      \`createTime\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      \`updateTime\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`));
  `);

  await queryFn(`
    CREATE UNIQUE INDEX \`email_UNIQUE\` ON \`user\` (\`email\` ASC) VISIBLE;
  `);
}
export async function downgrade(
  queryFn: (query: string, values?: any[]) => Promise<Array<any>>
) {
  await queryFn(`
    DROP TABLE IF EXISTS \`user\` ;
  `);
}
