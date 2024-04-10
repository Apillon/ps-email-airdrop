import { arrayLengthValidator, presenceValidator } from '@rawmodel/validators';
import {
  PopulateStrategy,
  SerializedStrategy,
  SystemErrorCode,
  ValidatorErrorCode,
} from '../config/values';
import { BaseSqlModel, prop } from './base-sql-model';
import { User } from './user';
import { Context } from '../context';
import { SqlError } from '../lib/errors';
import { PoolConnection } from 'mysql2/promise';

export class BatchUsers extends BaseSqlModel {
  protected _tableName = 'user';

  /**
   * id
   */
  @prop({
    parser: { resolver: User, array: true },
    populatable: [
      PopulateStrategy.DB,
      PopulateStrategy.PROFILE,
      PopulateStrategy.ADMIN,
    ],
    serializable: [
      SerializedStrategy.DB,
      SerializedStrategy.PROFILE,
      SerializedStrategy.ADMIN,
    ],
    validators: [
      {
        resolver: presenceValidator(),
        code: ValidatorErrorCode.USERS_NOT_PRESENT,
      },
      {
        resolver: arrayLengthValidator({ minOrEqual: 1 }),
        code: ValidatorErrorCode.USERS_NOT_PRESENT,
      },
    ],
  })
  public users: User[];

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
      await this.batchInsertUsers(SerializedStrategy.DB, conn);
      await this.db().commit(conn);
    } catch (err) {
      await this.db().rollback(conn);
      throw new SqlError(
        err,
        this.getContext(),
        SystemErrorCode.DATABASE_ERROR,
        'disinfection-block-batch/create',
      );
    }
    return;
  }

  async batchInsertUsers(strategy: SerializedStrategy, conn: PoolConnection) {
    const serialized = this.serialize(strategy);
    const users = serialized.users;

    const batchSize = 200;
    const batches = [[]];
    for (const idx in users) {
      if (parseInt(idx) >= batches.length * batchSize) {
        batches.push([]);
      }
      batches[batches.length - 1].push(users[idx]);
    }

    try {
      for (const batch of batches) {
        const createQuery = `
        INSERT INTO \`${this._tableName}\`
        ( ${Object.keys(batch[0])
          .map((x) => `\`${x}\``)
          .join(', ')} )
        VALUES
          ${batch
            .map((serializedModel, idx) => {
              return `(
              ${Object.keys(serializedModel)
                .map((key) => {
                  return `@${idx}_${key}`;
                })
                .join(', ')}
            )`;
            })
            .join(', ')}
        `;

        await this.db().paramExecuteBatch(createQuery, batch, conn);
      }

      await this.db().commit(conn);
    } catch (err) {
      await this.db().rollback(conn);
      throw new Error(err);
    }

    return this;
  }
}
