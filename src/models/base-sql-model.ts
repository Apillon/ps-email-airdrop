import { BaseModel } from "./base-model";
import { ModelConfig, prop } from "@rawmodel/core";
import { Context } from "../context";
import { integerParser, dateParser } from "@rawmodel/parsers";
import {
  PopulateStrategy,
  SerializedStrategy,
  ValidatorErrorCode,
} from "../config/values";
import { PoolConnection } from "mysql2/promise";
import { presenceValidator, enumInclusionValidator } from "../lib/validators";

export { prop };

export enum SqlModelStatus {
  DRAFT = 1,
  ACTIVE = 5,
  ARCHIVED = 8,
  DEACTIVATED = 9,
}

export abstract class BaseSqlModel extends BaseModel {
  /**
   * id
   */
  @prop({
    parser: { resolver: integerParser() },
    populatable: [PopulateStrategy.DB],
    serializable: [SerializedStrategy.PROFILE, SerializedStrategy.ADMIN],
  })
  public id: number;

  /**
   * status
   */
  @prop({
    parser: { resolver: integerParser() },
    populatable: [PopulateStrategy.DB],
    serializable: [
      SerializedStrategy.DB,
      SerializedStrategy.EXTENDED_DB,
      SerializedStrategy.PROFILE,
      SerializedStrategy.ADMIN,
    ],
    validators: [
      {
        resolver: presenceValidator(),
        code: ValidatorErrorCode.DATA_MODEL_STATUS_MISSING,
      },
      {
        resolver: enumInclusionValidator(SqlModelStatus),
        code: ValidatorErrorCode.DATA_MODEL_INVALID_STATUS,
      },
    ],
    defaultValue: SqlModelStatus.ACTIVE,
    fakeValue() {
      return SqlModelStatus.ACTIVE;
    },
  })
  public status: number;

  /**
   * createTime
   */
  @prop({
    parser: { resolver: dateParser() },
    populatable: [PopulateStrategy.DB],
    serializable: [SerializedStrategy.PROFILE, SerializedStrategy.ADMIN],
    validators: [],
  })
  public createTime: Date;

  /**
   * updateTime
   */
  @prop({
    parser: { resolver: dateParser() },
    populatable: [PopulateStrategy.DB],
    serializable: [SerializedStrategy.PROFILE, SerializedStrategy.ADMIN],
    validators: [],
  })
  public updateTime: Date;

  protected abstract _tableName;

  /**
   * Class constructor.
   * @param data Input data.
   * @param config Model configuration.
   */
  public constructor(data?: any, config?: ModelConfig<Context>) {
    super(data, config);
  }

  public exists() {
    return !!this.id;
  }

  public isActive() {
    return !!this.id && this.status !== SqlModelStatus.DEACTIVATED;
  }

  public async setStatus(status: SqlModelStatus, conn?: PoolConnection) {
    if (this.status === status) {
      // Already correct status
      return;
    }
    this.status = status;
    try {
      await this.update(SerializedStrategy.DB, { conn });
    } catch (err) {
      this.reset();
      throw err;
    }
  }

  public async populateById(id: number) {
    const data = await this.db().paramQuery(
      `
      SELECT * FROM ${this._tableName}
      WHERE id = @id
    `,
      { id }
    );

    if (data && data.length) {
      return this.populate(data[0], PopulateStrategy.DB);
    } else {
      return this.reset();
    }
  }

  public async populateByIdConn(id: number, conn: PoolConnection) {
    const data = await this.db().paramExecute(
      `
      SELECT * FROM ${this._tableName}
      WHERE id = @id
    `,
      { id },
      conn
    );

    if (data && data.length) {
      return this.populate(data[0], PopulateStrategy.DB);
    } else {
      return this.reset();
    }
  }

  public async insert(strategy: SerializedStrategy, conn?: PoolConnection) {
    const serializedModel = this.serialize(strategy);
    let isSingleTrans = false;
    if (!conn) {
      isSingleTrans = true;
      conn = await this.db().start();
    }
    try {
      const createQuery = `
      INSERT INTO \`${this._tableName}\`
      ( ${Object.keys(serializedModel)
        .map((x) => `\`${x}\``)
        .join(", ")} )
      VALUES (
        ${Object.keys(serializedModel)
          .map((key) => `@${key}`)
          .join(", ")}
      )`;

      await this.db().paramExecute(createQuery, serializedModel, conn);
      if (!this.id) {
        const req = await this.db().paramExecute(
          `SELECT last_insert_id() AS id;`,
          null,
          conn
        );
        this.id = req[0].id;
        await this.populateByIdConn(this.id, conn);
      }

      if (isSingleTrans) {
        await this.db().commit(conn);
      }
    } catch (err) {
      if (isSingleTrans) {
        await this.db().rollback(conn);
      }
      throw new Error(err);
    }

    return this;
  }

  public async duplicateInsert(
    strategy: SerializedStrategy,
    conn?: PoolConnection
  ) {
    const serializedModel = this.serialize(strategy);
    let isSingleTrans = false;
    if (!conn) {
      isSingleTrans = true;
      conn = await this.db().start();
    }
    try {
      const createQuery = `
      INSERT INTO \`${this._tableName}\`
      ( ${Object.keys(serializedModel)
        .map((x) => `\`${x}\``)
        .join(", ")} )
      VALUES (
        ${Object.keys(serializedModel)
          .map((key) => `@${key}`)
          .join(", ")}
      )
      ON DUPLICATE KEY UPDATE uuid = uuid`;

      await this.db().paramExecute(createQuery, serializedModel, conn);
      if (!this.id) {
        const req = await this.db().paramExecute(
          `SELECT last_insert_id() AS id;`,
          null,
          conn
        );
        this.id = req[0].id;
        await this.populateByIdConn(this.id, conn);
      }

      if (isSingleTrans) {
        await this.db().commit(conn);
      }
    } catch (err) {
      if (isSingleTrans) {
        await this.db().rollback(conn);
      }
      throw new Error(err);
    }

    return this;
  }

  public async update(
    strategy: SerializedStrategy = SerializedStrategy.DB,
    options?: { userId?: number; conn?: PoolConnection }
  ) {
    const serializedModel = this.serialize(strategy);
    let conn = null;
    let userId = null;

    if (options) {
      conn = options.conn || null;
      userId = options.userId || null;
    }
    // let conn = options ? opt
    // const { userId } = options;
    // remove non-updatable parameters
    delete serializedModel.id;
    delete serializedModel.createTime;
    delete serializedModel.updateTime;

    let isSingleTrans = false;
    if (!conn) {
      isSingleTrans = true;
      conn = await this.db().start();
    }
    try {
      const createQuery = `
      UPDATE \`${this._tableName}\`
      SET
        ${Object.keys(serializedModel)
          .map((x) => `\`${x}\` = @${x}`)
          .join(",\n")}
      WHERE id = @id
      ${userId ? `AND user_id = ${userId}` : ""}
      `;

      // re-set id parameter for where clause.
      serializedModel.id = this.id;

      await this.db().paramExecute(createQuery, serializedModel, conn);

      if (isSingleTrans) {
        await this.db().commit(conn);
      }
    } catch (err) {
      if (isSingleTrans) {
        await this.db().rollback(conn);
      }
      throw new Error(err);
    }

    return this;
  }

  /**
   * Permanently removes from DB. Use carefully.
   * @param conn If transaction.
   */
  public async removeFromDb(conn?: PoolConnection) {
    let isSingleTrans = false;
    if (!conn) {
      isSingleTrans = true;
      conn = await this.db().start();
    }
    try {
      const createQuery = `
      DELETE FROM \`${this._tableName}\`
      WHERE id = @id
      `;

      await this.db().paramExecute(createQuery, { id: this.id }, conn);

      if (isSingleTrans) {
        await this.db().commit(conn);
      }
    } catch (err) {
      if (isSingleTrans) {
        await this.db().rollback(conn);
      }
      throw new Error(err);
    }

    return this;
  }
}
