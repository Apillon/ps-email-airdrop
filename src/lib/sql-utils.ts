import { env } from "../config/env";
import * as SqlString from "sqlstring";
import { MySql } from "./mysql";

export interface SqlQueryObject {
  /**
   * 'Select' part of query
   */
  qSelect: string;
  /**
   * 'From' part of query
   */
  qFrom: string;
  /**
   * 'GROUP' part of query
   */
  qGroup?: string;
  /**
   * 'ORDER BY' and 'LIMIT - OFFSET' part of query
   */
  qFilter?: string;
}

/**
 * Function returns object for database query parameters
 *
 * @export
 * @param defaultParameters  Key-value object. All expected parameters should be listed, value can be null.
 * @param tableAlias table alias name
 * @param fieldMap URL query fields mapped with database query fields.
 * @param urlQuery URL query parameters.
 * @returns Object with parameters for database listing search.
 */
export function getQueryParams(
  defaultParameters: Object,
  tableAlias: string,
  fieldMap: any,
  urlQuery: any
) {
  const limit =
    parseInt(urlQuery.itemsPerPage) || env.PAGE_DEFAULT_LIMIT || 100;
  const offset = ((parseInt(urlQuery.page) || 1) - 1) * limit;
  const orderArr = getOrderField(
    urlQuery.sortBy,
    urlQuery.sortDesc,
    tableAlias,
    fieldMap
  );

  delete urlQuery.page;
  delete urlQuery.limit;
  delete urlQuery.orderBy;
  delete urlQuery.desc;

  return {
    params: {
      ...defaultParameters,
      ...urlQuery,
    },
    filters: {
      limit,
      offset,
      orderArr,
    },
  };
}

function getOrderField(names, orders, tableAlias, map = {}) {
  if (!names) {
    names = ["id"];
  }
  const orderArray = [];
  for (const [idx, name] of names.entries()) {
    let adjustedName = map[name];
    if (!map[name]) {
      // SqlString.escape prevents SQL injection!
      adjustedName = SqlString.escapeId(
        `${tableAlias ? `${tableAlias}.` : ""}${name}`
      );
    }
    if (orders && orders.length) {
      if (Array.isArray(adjustedName)) {
        for (const nameEntry of adjustedName) {
          orderArray.push(
            `${nameEntry} ${orders[idx] == "true" ? "DESC" : ""}`
          );
        }
      } else {
        orderArray.push(
          `${adjustedName} ${orders[idx] == "true" ? "DESC" : ""}`
        );
      }
    } else {
      orderArray.push(adjustedName);
    }
  }
  return orderArray;
}

export async function selectAndCountQuery(
  db: MySql,
  queryObj: SqlQueryObject,
  params: any,
  countByField: string
): Promise<{ items: Array<any>; total: number }> {
  const querySelect = [
    queryObj.qSelect,
    queryObj.qFrom,
    queryObj.qGroup,
    queryObj.qFilter,
  ].join("\n");

  const queryCount = `
  SELECT COUNT(*) as total
    FROM (
      SELECT ${countByField || "id"}
      ${queryObj.qFrom}
      ${queryObj.qGroup ? `GROUP BY ${countByField || "id"}` : ""}
    ) AS T;
  `;

  let items: Array<any>;
  let totalResults: Array<any>;
  const workers = [];
  try {
    workers.push(
      db.paramExecute(querySelect, params).then((res) => (items = res))
    );
    workers.push(
      db.paramExecute(queryCount, params).then((res) => (totalResults = res))
    );
    await Promise.all(workers);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  const total = totalResults.length ? totalResults[0].total : 0;

  return { items, total };
}

export function dateToSqlString(date: Date): string {
  return date.toISOString().replace(/T/, " ").replace(/Z/, "");
}
