/**
 * Get assorted error messages: messages for fields (validation) and general errors
 */
export function apiError(
  err: {
    data: {
      code?: number;
      message?: string;
      path?: string[];
      errors?: { code: number; message: string; path: string[] }[];
    };
  },
  getMessage = true,
  defaultMessage = ''
): { errors: (string | number)[]; fields: { [k: string]: string | number } } {
  if (err?.data?.code) {
    return {
      errors: [getMessage ? getErrorMsg(err.data.code, defaultMessage) : err.data.code],
      fields: {},
    };
  }

  if (!err?.data?.errors || !Array.isArray(err.data.errors) || !err.data.errors.length) {
    return { errors: [getMessage ? getErrorMsg(undefined, defaultMessage) : 500001], fields: {} };
  }

  const res = {
    errors: [] as (string | number)[],
    fields: {} as { [k: string]: string | number },
  };

  err.data.errors.forEach(e => {
    if (e.path && e.path.length && typeof e.path[0] === 'string') {
      res.fields[e.path[0]] = getMessage ? getErrorMsg(e.code, defaultMessage) : e.code;
    } else {
      res.errors.push(getMessage ? getErrorMsg(e.code, defaultMessage) : e.code);
    }
  });

  return res;
}

export function getErrorMsg(code = 500001, defaultMessage = '') {
  if (code === 500001 && defaultMessage) {
    return defaultMessage;
  }

  if (!(code in ErrorCodes)) {
    return defaultMessage || ErrorCodes[500001];
  }

  return ErrorCodes[code];
}

/**
 * Define message for each error
 */
export const ErrorCodes = {
  // RouteErrorCode
  400000: 'INVALID_REQUEST',
  400001: 'PROFILE_NOT_IDENTIFIED',
  400002: 'PROFILE_CREDENTIALS_INVALID',
  400003: 'REQUEST_TOKEN_INVALID',
  400004: 'User does not exists, please login with different wallet',
  400005: 'Missing signature',
  400006: 'Token does not exists',
  400007: 'NFT already claimed',

  // SystemErrorCode
  500000: 'DEFAULT_SYSTEM_ERROR',
  500001: 'There was an error with your request. Please try again later.',
  500002: 'SQL_SYSTEM_ERROR',
  500003: 'VECTOR_DB_SYSTEM_ERROR',
  500004: 'EMAIL_SYSTEM_ERROR',
} as { [k: number]: string };
