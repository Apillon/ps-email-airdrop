import { presenceValidator } from "@rawmodel/validators";
import {
  PopulateStrategy,
  SerializedStrategy,
  ValidatorErrorCode,
} from "../config/values";
import { uniqueFieldValue } from "../lib/validators";
import { BaseSqlModel, prop } from "./base-sql-model";
import { stringTrimParser } from "../lib/parsers";
import { stringParser } from "@rawmodel/parsers";

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
}
