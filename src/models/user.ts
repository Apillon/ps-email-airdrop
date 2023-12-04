import { presenceValidator } from "@rawmodel/validators";
import {
  PopulateStrategy,
  SerializedStrategy,
  SystemErrorCode,
  ValidatorErrorCode,
} from "../config/values";
import { uniqueFieldValue } from "../lib/validators";
import { BaseSqlModel, prop } from "./base-sql-model";
import { stringTrimParser } from "../lib/parsers";
import { stringParser } from "@rawmodel/parsers";
import { Context } from "../context";
import { SqlError } from "../lib/errors";

export class User extends BaseSqlModel {
  protected _tableName = "user";

  /**
   * email
   */
  @prop({
    parser: { resolver: stringTrimParser() },
    populatable: [PopulateStrategy.DB, PopulateStrategy.ADMIN],
    serializable: [
      SerializedStrategy.DB,
      SerializedStrategy.PROFILE,
      SerializedStrategy.ADMIN,
    ],
    validators: [
      {
        resolver: presenceValidator(),
        code: ValidatorErrorCode.PROFILE_EMAIL_NOT_PRESENT,
      },
      {
        resolver: uniqueFieldValue("user", "email"),
        code: ValidatorErrorCode.PROFILE_EMAIL_ALREADY_TAKEN,
      },
    ],
  })
  public email: string;

  /**
   * wallet
   */
  @prop({
    parser: { resolver: stringParser() },
    populatable: [PopulateStrategy.DB, PopulateStrategy.ADMIN],
    serializable: [
      SerializedStrategy.DB,
      SerializedStrategy.PROFILE,
      SerializedStrategy.ADMIN,
    ],
  })
  public wallet: string;

  /**
   * tx hash
   */
  @prop({
    parser: { resolver: stringParser() },
    populatable: [PopulateStrategy.DB, PopulateStrategy.ADMIN],
    serializable: [
      SerializedStrategy.DB,
      SerializedStrategy.PROFILE,
      SerializedStrategy.ADMIN,
    ],
  })
  public tx_hash: string;

  /**
   * Class constructor.
   * @param data Input data.
   * @param context Context.
   */
  public constructor(data?: any, context?: Context) {
    super(data, { context });
  }

  public async create() {
    const conn = await this.db().start();

    try {
      await this.insert(SerializedStrategy.DB, conn);
      await this.db().commit(conn);
    } catch (err) {
      await this.db().rollback(conn);
      throw new SqlError(
        err,
        this.getContext(),
        SystemErrorCode.DATABASE_ERROR,
        "user/create"
      );
    }
  }
}
