import { BaseSqlModel, SqlModelStatus } from "../models/base-sql-model";
import { isNullOrUndefined } from "util";
import { stringLengthValidator } from "@rawmodel/validators";

/**
 * Expose standard validators.
 */
export * from "@rawmodel/validators";

export function conditionalPresenceValidator(condition: boolean, value: any) {
  if (condition) {
    return !!value;
  } else {
    return true;
  }
}

export function conditionalStringLengthValidator(
  condition: boolean,
  recipe: {
    bytes?: boolean;
    min?: number;
    minOrEqual?: number;
    max?: number;
    maxOrEqual?: number;
  }
) {
  if (condition) {
    return stringLengthValidator(recipe);
  } else {
    return (_value?) => true;
  }
}

/**
 * Validate if array is present.
 * @param value any
 */
export function customPresenceValidator() {
  return function (value: any) {
    return !value;
  };
}

/**
 * Validate if array is present.
 * @param value any
 */
export function customArrayLengthValidator(options?: {
  min?: number;
  minOrEqual?: number;
  max?: number;
  maxOrEqual?: number;
}) {
  return function (value: any) {
    if (Array.isArray(value)) {
      return false;
    }
    const size = value.length;
    const { min, minOrEqual, max, maxOrEqual } = options;
    if (typeof min === "number" && !(size > min)) {
      return false;
    }
    if (typeof minOrEqual === "number" && !(size >= minOrEqual)) {
      return false;
    }
    if (typeof max === "number" && !(size < max)) {
      return false;
    }
    if (typeof maxOrEqual === "number" && !(size <= maxOrEqual)) {
      return false;
    }
    return true;
  };
}

/**
 * Validates uniqueness of field value.
 */
export function uniqueFieldValue(
  sqlTableName: string,
  fieldName: string,
  idField = "id",
  checkNull = false
) {
  return async function (this: BaseSqlModel, value: any) {
    if (!checkNull && isNullOrUndefined(value)) {
      return true;
    }
    const count = await this.db()
      .paramExecute(
        `
      SELECT COUNT(*) as Count FROM \`${sqlTableName}\`
      WHERE \`${fieldName}\` = @value
      AND (@id IS NULL OR (@id IS NOT NULL AND \`${idField}\` <> @id ))`,
        { value, id: this.id }
      )
      .then((rows) => rows[0].Count);

    return count === 0;
  };
}

/**
 * Validates uniqueness of field value by foreign id.
 */
export function uniqueFieldValueById(
  sqlTableName: string,
  fieldName: string,
  foreignId: string,
  idField = "id",
  checkNull = false
) {
  return async function (this: BaseSqlModel, value: any) {
    if (!checkNull && isNullOrUndefined(value)) {
      return true;
    }
    const count = await this.db()
      .paramExecute(
        `
      SELECT COUNT(*) as Count FROM \`${sqlTableName}\`
      WHERE \`${fieldName}\` = @value AND \`${foreignId}\` = @foreignId
      AND (@id IS NULL OR (@id IS NOT NULL AND \`${idField}\` <> @id ))`,
        { value, id: this.id, foreignId: this[foreignId] }
      )
      .then((rows) => rows[0].Count);

    return count === 0;
  };
}

/**
 * Validates uniqueness of field value by foreign id.
 */
export function uniqueFieldValueByIdActive(
  sqlTableName: string,
  fieldName: string,
  foreignId: string,
  idField = "id",
  checkNull = false
) {
  return async function (this: BaseSqlModel, value: any) {
    if (!checkNull && isNullOrUndefined(value)) {
      return true;
    }
    const count = await this.db()
      .paramExecute(
        `
      SELECT COUNT(*) as Count FROM \`${sqlTableName}\`
      WHERE \`${fieldName}\` = @value AND \`${foreignId}\` = @foreignId AND status < 9
      AND (@id IS NULL OR (@id IS NOT NULL AND \`${idField}\` <> @id ))`,
        { value, id: this.id, foreignId: this[foreignId] }
      )
      .then((rows) => rows[0].Count);

    return count === 0;
  };
}
/**
 *  Validates existence of item in a different table.
 */

export function foreignKeyPresence(sqlTableName: string) {
  return async function (this: BaseSqlModel, value: any) {
    const count = await this.db()
      .paramExecute(
        `
      SELECT COUNT(*) as Count FROM \`${sqlTableName}\`
      WHERE id = @value
    `,
        { value }
      )
      .then((rows) => rows[0].Count);

    return count !== 0;
  };
}

/**
 * Validates existence of array property.
 */
export function arrayPresenceValidator(propertyName: string) {
  if (!this[propertyName]) {
    return false;
  }
  return true;
}

/**
 *  Validates if value is inside enumerator
 */
export function enumInclusionValidator(enumerator: any) {
  return function (value: any) {
    let valid = false;
    for (const key in enumerator) {
      if (enumerator.hasOwnProperty(key)) {
        if (value === enumerator[key]) {
          valid = true;
          break;
        }
      }
    }
    return valid;
  };
}

export function statusDependantPresenceValidator(
  status: SqlModelStatus,
  exclusion = false
) {
  return function (this: BaseSqlModel, value: any) {
    if (
      (this.status == status && !exclusion) ||
      (this.status != status && exclusion)
    ) {
      return !!value;
    } else {
      return true;
    }
  };
}

export function regexValidator(regex: RegExp) {
  return function (value: any) {
    if (!regex) {
      return false;
    }
    regex.lastIndex = 0;
    return regex.test(value);
  };
}
