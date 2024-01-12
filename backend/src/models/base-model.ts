import { Model, ModelConfig, prop } from "@rawmodel/core";
import { Context } from "../context";
// tslint:disable-next-line: no-import-side-effect
import "reflect-metadata";
import { SerializedStrategy } from "../config/values";
import { PoolConnection } from "mysql2/promise";

/**
 * Common model related objects.
 */
export { prop };
const fieldNameMetadataKey = Symbol("fieldName");
export function fieldName(name: string): any {
  return Reflect.metadata(fieldNameMetadataKey, name);
}

export function getFieldName(target: any, propertyKey: string) {
  return Reflect.getMetadata(fieldNameMetadataKey, target, propertyKey);
}

/**
 * Base model.
 */
export abstract class BaseModel extends Model<Context> {
  public _fieldNames = {};

  protected _tableName = "";

  /**
   * Class constructor.
   * @param data Input data.
   * @param config Model configuration.
   */
  public constructor(data?: any, config?: ModelConfig<Context>) {
    super(data, config);
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

  public async removeFromDbFk(keys?: string[], conn?: PoolConnection) {
    let isSingleTrans = false;
    if (!conn) {
      isSingleTrans = true;
      conn = await this.db().start();
    }
    try {
      let createQuery = `
      DELETE FROM \`${this._tableName}\`
      WHERE ${keys[0]} = @${keys[0]}
      `;

      for (let i = 1; i < keys.length; i++) {
        createQuery = `${createQuery}
          AND ${keys[i]} = @${keys[i]}`;
      }

      const queryParams = {};
      for (const key of keys) {
        queryParams[key] = this[key];
      }

      await this.db().paramExecute(createQuery, queryParams, conn);

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

  public populate(data: Object, strategy?: any) {
    const mappedObj = {};
    if (!data) {
      return super.populate(mappedObj, strategy);
    }
    for (const key of Object.keys(this.__props)) {
      if (data.hasOwnProperty(key)) {
        mappedObj[key] = data[key];
      } else if (data.hasOwnProperty(getFieldName(this, key))) {
        mappedObj[key] = data[getFieldName(this, key)];
      }
    }
    return super.populate(mappedObj, strategy);
  }

  protected db() {
    let ctx = this.getContext();
    if (ctx["context"]) {
      ctx = ctx["context"];
    }
    return ctx.mysql;
  }
}
