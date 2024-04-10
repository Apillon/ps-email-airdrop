import * as mysql from 'mysql2/promise';
import { IEnv } from '../config/env';
import { ProcedureError } from './errors';
import { writeLog, LogType } from './logger';
import { PoolConnection } from 'mysql2/promise';
import * as SqlString from 'sqlstring';

/**
 * MySQL class.
 */
export class MySql {
  public env: IEnv;
  // public db: mysql.Connection;
  public db: mysql.Pool;

  /**
   * Class constructor.
   * @param env Environment variables.
   */
  public constructor(env: IEnv) {
    this.env = env;
  }

  /**
   * Starts database client.
   */
  public async connect() {
    if (!this.db) {
      try {
        this.db = await mysql.createPool({
          host:
            this.env.APP_ENV === 'testing'
              ? this.env.MYSQL_HOST_TEST
              : this.env.MYSQL_HOST,
          port:
            this.env.APP_ENV === 'testing'
              ? this.env.MYSQL_PORT_TEST
              : this.env.MYSQL_PORT,
          user:
            this.env.APP_ENV === 'testing'
              ? this.env.MYSQL_USER_TEST
              : this.env.MYSQL_USER,
          password:
            this.env.APP_ENV === 'testing'
              ? this.env.MYSQL_PASSWORD_TEST
              : this.env.MYSQL_PASSWORD,
          database:
            this.env.APP_ENV === 'testing'
              ? this.env.MYSQL_DB_TEST
              : this.env.MYSQL_DB,
          waitForConnections: true,
          decimalNumbers: true,

          connectionLimit:
            (this.env.APP_ENV === 'testing'
              ? this.env.MYSQL_POOL_TEST
              : this.env.MYSQL_POOL) || 10,

          queueLimit: 100,
          // ssl: env.USE_DB_SSL ? {
          //   ca: fs.readFileSync(`${__dirname}/keys/ca-cert.pem`).toString(),
          //   key: fs.readFileSync(`${__dirname}/keys/client-key.pem`).toString(),
          //   cert: fs.readFileSync(`${__dirname}/keys/client-cert.pem`).toString()
          // } : undefined
        });
        const host =
          this.env.APP_ENV === 'testing'
            ? this.env.MYSQL_HOST_TEST
            : this.env.MYSQL_HOST;
        const port =
          this.env.APP_ENV === 'testing'
            ? this.env.MYSQL_PORT_TEST
            : this.env.MYSQL_PORT;
        const database =
          this.env.APP_ENV === 'testing'
            ? this.env.MYSQL_DB_TEST
            : this.env.MYSQL_DB;
        writeLog(
          LogType.INFO,
          `Connected to DB: ${host}:${port} | ${database}`,
          'mysql.ts',
          'connect',
        );
      } catch (err) {
        writeLog(
          LogType.ERROR,
          'Database connection failed.',
          'mysql.ts',
          'connect',
          err,
        );
      }
    } else {
      writeLog(LogType.INFO, `Already connected to DB!`, 'mysql.ts', 'connect');
    }
    return this;
  }

  /**
   * Closes database client.
   */
  public async close() {
    if (this.db) {
      await this.db.end();
    }

    return this;
  }

  /**
   * Ensures open connection to DB
   *
   */
  public async ensureAlive(conn?: mysql.PoolConnection) {
    try {
      if (!conn) {
        conn = await this.db.getConnection();
      }

      if (!conn || (conn as any).connection.stream.readyState !== 'open') {
        this.db = undefined;
        await this.connect();
      }
    } catch (err) {
      this.db = undefined;
      await this.connect();
    }
  }

  /**
   * Call single stored procedure inside transaction
   *
   * @param procedure name of procedure
   * @param data procedure parameters
   * @param [options={multiSet: boolean}] additional options
   */
  public async callSingle(
    procedure: String,
    data: Object,
    options: { multiSet?: boolean } = {},
  ) {
    // console.time('Call Single');
    const conn = await this.start();
    try {
      const result = await this.call(procedure, data, conn, options);
      await this.commit(conn);
      // console.timeEnd( 'Call Single');
      return result;
    } catch (err) {
      await this.rollback(conn);
      // console.timeEnd( 'Call Single');
      throw err;
    }
  }

  /**
   * Call stored procedure on database
   *
   * @param procedure procedure name
   * @param data Object with call parameters
   * @returns array of results from database
   */
  public async call(
    procedure: String,
    data: Object,
    connection?: PoolConnection,
    options: { multiSet?: boolean } = {},
  ) {
    if (!connection) {
      connection = await this.db.getConnection();
      await this.ensureAlive(connection);
    }

    let result;
    const query = `CALL ${procedure}(${
      Object.keys(data).length
        ? Array(Object.keys(data).length).fill('?').join(',')
        : ''
    });`;

    writeLog(LogType.SQL, query, 'lib/mysql.ts', 'call');
    writeLog(LogType.SQL, this.mapValues(data, true), 'lib/mysql.ts', 'call');

    // console.time('SQL procedure CALL');
    result = await connection.query(query, this.mapValues(data));
    // console.timeEnd( 'SQL procedure CALL');

    for (const resultSet of result[0] as mysql.RowDataPacket[][]) {
      if (resultSet.length && resultSet[0].ErrorCode > 0) {
        throw new ProcedureError(
          resultSet[0].ErrorCode,
          resultSet[0].Message,
          result,
        );
      }
    }
    if (!options.multiSet) {
      return result[0][0];
    } else {
      return result[0];
    }
  }

  public async start() {
    // await this.db.query('SET SESSION autocommit = 0; START TRANSACTION;');
    const conn = await this.db.getConnection();
    await this.ensureAlive(conn);
    await conn.beginTransaction();
    writeLog(LogType.SQL, 'BEGIN TRANSACTION', 'mysql.ts', 'start');
    return conn;
  }

  public async commit(connection: PoolConnection) {
    // await this.db.query('COMMIT; SET SESSION autocommit = 1;');
    await connection.commit();
    connection.release();
    writeLog(LogType.SQL, 'COMMIT TRANSACTION', 'mysql.ts', 'commit');
  }

  public async rollback(connection: PoolConnection) {
    // await this.db.query('ROLLBACK; SET SESSION autocommit = 1;');
    await connection.rollback();
    connection.release();
    writeLog(LogType.SQL, 'ROLLBACK TRANSACTION', 'mysql.ts', 'rollback');
  }

  /**
   * Translate properties to array of property values for procedure call
   *
   * @param data Object to translate
   * @param [logOutput=false] For logging purpose we should mask the password values
   * @returns Array of values
   */
  public mapValues(data: Object, logOutput = false) {
    const protectedFields = ['password'];
    const values = [];
    for (const i in data) {
      if (!logOutput || protectedFields.indexOf(i) < 0) {
        values.push(data[i]);
      } else {
        values.push('*****');
      }
    }
    return values;
  }

  public async paramQuery(query: string, values?: Object) {
    // console.time('Param Query');

    if (values) {
      for (const key of Object.keys(values)) {
        if (Array.isArray(values[key])) {
          values[key] = values[key].join(',');
        }
        // SqlString.escape prevents SQL injection!
        const re = new RegExp(`@${key}\\b`, 'gi');
        query = query.replace(
          re,
          values[key] ? SqlString.escape(values[key]) : 'NULL',
        );
      }
    }
    // console.log(query);
    writeLog(LogType.SQL, query, 'lib/mysql.ts', 'paramQuery');

    const conn = await this.db.getConnection();
    await this.ensureAlive(conn);
    const result = await conn.query(query);
    conn.release();

    // console.timeEnd( 'Param Query');

    return result[0] as Array<any>;
  }

  /**
   * Function replaces sql query parameters with "@variable" notation with values from object {variable: replace_value}
   * and executes prepared statement
   * @param query SQL query
   * @param values object with replacement values
   * @param connection PoolConnection reference - needed if query is part of transaction
   */
  public async paramExecute(
    query: string,
    values?: Object,
    connection?: PoolConnection,
  ) {
    // const queryId = Math.round(Math.random() * 10000);
    // console.time('Param Execute');
    // array with values for prepared statement
    // console.time(`Prepare SQL [${queryId}]`);
    const sqlParamValues = [];

    if (values) {
      // split query to array to find right order of variables
      const queryArray = query
        .split(/\n|\s/)
        .filter((x) => !!x && /@.*\b/.test(x));

      for (const word of queryArray) {
        for (const key of Object.keys(values)) {
          // transform array values to string
          if (Array.isArray(values[key])) {
            values[key] = values[key].join(',');
          }

          // regex
          const re = new RegExp(`@${key}\\b`, 'gi');

          if (word.match(re)) {
            sqlParamValues.push(values[key]);
          }
        }
      }

      // replace keys with '?' for prepared statement
      for (const key of Object.keys(values)) {
        const re = new RegExp(`@${key}\\b`, 'gi');
        query = query.replace(re, '?');
      }
    }
    // console.timeEnd(`Prepare SQL [${queryId}]`);

    // console.log(query);
    // console.time(`Logs [${queryId}]`);
    writeLog(LogType.SQL, query, 'lib/mysql.ts', 'paramExecute');
    writeLog(LogType.SQL, sqlParamValues, 'lib/mysql.ts', 'paramExecute');
    // console.timeEnd(`Logs [${queryId}]`);

    let result;

    if (!connection) {
      // const time = process.hrtime();
      const conn = await this.db.getConnection();
      await this.ensureAlive(conn);
      result = await conn.execute(query, sqlParamValues);
      conn.release();
      // const diff = process.hrtime(time);
      // console.log('SQL %d Execution time: %ds %dms', queryId, diff[0], diff[1] / 1000000);
    } else {
      // const time = process.hrtime();
      result = await connection.execute(query, sqlParamValues);
      // const diff = process.hrtime(time);
      // console.log('SQL %d Execution time: %ds %dms', queryId, diff[0], diff[1] / 1000000);
    }

    // console.timeEnd( 'Param Execute');
    return result[0] as Array<any>;
  }

  /**
   * Function replaces sql query parameters with "@variable" notation with values from objects {variable: replace_value}
   * and executes prepared statement
   * @param query SQL query
   * @param values objects with replacement values
   * @param connection PoolConnection reference - needed if query is part of transaction
   */
  public async paramExecuteBatch(
    query: string,
    values?: Object[],
    connection?: PoolConnection,
  ) {
    // const queryId = Math.round(Math.random() * 10000);
    // console.time('Param Execute');
    // array with values for prepared statement
    // console.time(`Prepare SQL [${queryId}]`);
    const sqlParamValues = [];

    if (values) {
      // split query to array to find right order of variables
      const queryArray = query
        .split(/\n|\s/)
        .filter((x) => !!x && /@.*\b/.test(x));
      for (const word of queryArray) {
        const index = word.split('_')[0].substring(1);
        const value = values[index];
        for (const key of Object.keys(value)) {
          // transform array value to string
          if (Array.isArray(value[key])) {
            value[key] = value[key].join(',');
          }

          // regex
          const re = new RegExp(`@${index}_${key}\\b`, 'gi');

          if (word.match(re)) {
            sqlParamValues.push(value[key]);
          }
        }
      }

      // replace keys with '?' for prepared statement
      for (const [index, value] of values.entries()) {
        for (const key of Object.keys(value)) {
          const re = new RegExp(`@${index}_${key}\\b`, 'gi');
          query = query.replace(re, '?');
        }
      }
    }
    // console.timeEnd(`Prepare SQL [${queryId}]`);

    // console.log(query);
    // console.time(`Logs [${queryId}]`);
    const omitLong = true;
    const queryLog =
      omitLong && query.length > 3000 ? 'query omitted (too long)' : query;
    const sqlParamValuesLog =
      omitLong && query.length > 3000
        ? 'query params omitted (too long)'
        : sqlParamValues;
    writeLog(LogType.SQL, queryLog, 'lib/mysql.ts', 'paramExecuteBatch');
    writeLog(
      LogType.SQL,
      sqlParamValuesLog,
      'lib/mysql.ts',
      'paramExecuteBatch',
    );
    // console.timeEnd(`Logs [${queryId}]`);

    let result;

    if (!connection) {
      // const time = process.hrtime();
      const conn = await this.db.getConnection();
      await this.ensureAlive(conn);
      result = await conn.execute(query, sqlParamValues);
      conn.release();
      // const diff = process.hrtime(time);
      // console.log('SQL %d Execution time: %ds %dms', queryId, diff[0], diff[1] / 1000000);
    } else {
      // const time = process.hrtime();
      result = await connection.execute(query, sqlParamValues);
      // const diff = process.hrtime(time);
      // console.log('SQL %d Execution time: %ds %dms', queryId, diff[0], diff[1] / 1000000);
    }

    // console.timeEnd( 'Param Execute');
    return result[0] as Array<any>;
  }
}
