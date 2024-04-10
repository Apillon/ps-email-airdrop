import { Model } from '@rawmodel/core';
import messages from '../config/messages';
import { writeLog, LogType } from './logger';
import { Context } from '../context';
import { SystemErrorCode } from '../config/values';

/**
 * Handled system error.
 */
export class SystemError extends Error {
  public code: number;

  public readonly status: number;

  public constructor(code: number, ctx?: Context, sourceFunction?: string) {
    super(messages(code));

    this.name = this.constructor.name;
    this.code = code;
    this.status = 500;

    Error.captureStackTrace(this, this.constructor);

    // TODO
    writeLog(
      LogType.ERROR,
      //  `(user: ${ctx && ctx.user ? `${ctx.user.id} ${ctx.user.email}` : "NA"})`,
      `(id: ${ctx.id} : "NA"})`,
      'SystemError',
      sourceFunction,
      this,
    );
  }
}

/**
 * Handled invalid resources or resource not found error.
 */
export class ResourceError extends Error {
  public code: number;
  public readonly status: number;

  /**
   * Class constructor.
   * @param code Error identification code.
   * @param details Debug information for administrator.
   */
  public constructor(code: number, ctx?: Context, sourceFunction?: string) {
    super(messages(code));

    this.name = this.constructor.name;
    this.code = code;
    this.status = 400;

    Error.captureStackTrace(this, this.constructor);

    writeLog(
      LogType.ERROR,
      `(id: ${ctx?.id} : "NA"})`,
      'ResourceError',
      sourceFunction,
      this,
    );
  }
}

/**
 * Not authenticated access error.
 */
export class UnauthenticatedError extends Error {
  public code: number;
  public readonly status: number;

  /**
   * Class constructor.
   * @param code Error identification code.
   * @param details Debug information for administrator.
   */
  public constructor(code: number, ctx?: Context, sourceFunction?: string) {
    super(messages(code));

    this.name = this.constructor.name;
    this.code = code;
    this.status = 401;

    Error.captureStackTrace(this, this.constructor);

    writeLog(
      LogType.MESSAGE,
      // `(user: ${ctx && ctx.user ? `${ctx.user.id} ${ctx.user.email}` : "NA"})`,
      `(id: ${ctx.id} : "NA"})`,
      'UnauthenticatedError',
      sourceFunction,
      this,
    );
  }
}

/**
 * Not authorized access error.
 */
export class UnauthorizedError extends Error {
  public code: number;
  public readonly status: number;

  /**
   * Class constructor.
   * @param code Error identification code.
   * @param details Debug information for administrator.
   */
  public constructor(code: number, ctx?: Context, sourceFunction?: string) {
    super(messages(code));

    this.name = this.constructor.name;
    this.code = code;
    this.status = 403;

    Error.captureStackTrace(this, this.constructor);

    writeLog(
      LogType.MESSAGE,
      //`(user: ${ctx && ctx.user ? `${ctx.user.id} ${ctx.user.email}` : "NA"})`,

      `(id: ${ctx.id} : "NA"})`,
      'UnauthorizedError',
      sourceFunction,
      this,
    );
  }
}

/**
 * Model validation error.
 */
export class ValidationError extends Error {
  public model: Model;
  public readonly status: number;

  /**
   * Class constructor.
   * @param model Model instance.
   */
  public constructor(model: Model, ctx?: Context, sourceFunction?: string) {
    super();

    this.name = this.constructor.name;
    this.model = model;
    this.status = 422;

    Error.captureStackTrace(this, this.constructor);

    const validationErrorsStr = this.model
      .collectErrors()
      .map((x) => {
        return JSON.stringify({
          code: x.code,
          message: messages(x.code),
          path: x.path,
        });
      })
      .join(', ');

    writeLog(
      LogType.MESSAGE,
      `${validationErrorsStr}`,
      'ValidationError',
      sourceFunction,
      this,
    );
  }
}

export class ProcedureError extends Error {
  public sqlResult: any;
  public code: number;
  public message: string;
  public readonly status: number;

  public constructor(errCode: number, errMsg: string, sqlResult: any) {
    super(messages(errCode) || errMsg);
    this.status = 500;
    this.sqlResult = sqlResult;
    this.code = errCode;
    this.message = errMsg;

    Error.captureStackTrace(this, this.constructor);

    writeLog(
      LogType.MESSAGE,
      `${errMsg} | Result: ${JSON.stringify(this.sqlResult)}`,
      'ProcedureError',
      '',
      this,
    );
  }
}

export class SqlError extends Error {
  public code: number;
  public readonly status: number;

  /**
   * Class for handling SQL query errors
   * @param error original error
   * @param ctx context
   * @param details err details
   * @param code message code
   * @param query SQL query
   */
  public constructor(
    error?: Error,
    ctx?: Context,
    code?: number,
    query?: string,
    sourceFunction?: string,
  ) {
    super(
      messages(code) ||
        messages(SystemErrorCode.DATABASE_ERROR) ||
        error.message,
    );

    this.name = this.constructor.name;
    this.code = code || SystemErrorCode.DATABASE_ERROR;
    this.status = 500;

    Error.captureStackTrace(this, this.constructor);

    writeLog(
      LogType.ERROR,
      `( sql: ${query || 'NA'}): ${error ? error.message : ''}`,
      'SqlError',
      sourceFunction,
      this,
    );
  }
}

export class GenericError extends Error {
  public code: number;
  public message: string;
  public error: any;
  public readonly status;

  public constructor(errCode: number, errMsg: string, error?: any) {
    super(messages(errCode) || errMsg);
    this.code = errCode;
    this.status = 400;
    this.message = errMsg;
    this.error = error;
  }
}
