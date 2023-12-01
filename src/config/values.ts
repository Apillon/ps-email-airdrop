/**
 * Serialized strategy.
 */
export enum SerializedStrategy {
  PROFILE = "profile",
  DB = "db",
  EXTENDED_DB = "extended_db",
  SNAPSHOT = "snapshot",
  ADMIN = "admin",
  SELF = "self",
  EXTERNAL = "external",
  IMAGE = "image",
}

/**
 * Populate strategy.
 */
export enum PopulateStrategy {
  ADMIN = "admin",
  PROFILE = "profile",
  DB = "db",
}

/**
 * Default user roles
 */
export enum DefaultUserRoles {
  ADMIN = 1,
  DISTRIBUTOR = 2,
  USER = 3,
}

/**
 * Default pagination values.
 */
export enum PaginationValues {
  PAGE_MAX_LIMIT = 100,
  PAGE_DEFAULT_LIMIT = 25,
}

/**
 * Request Token types.
 */
export enum RequestToken {
  CREATE_PROFILE = "createProfile",
}

/**
 * System Error codes.
 */
export enum SystemErrorCode {
  UNHANDLED_SYSTEM_ERROR = 500000,
  DATABASE_ERROR = 500001,
  EMAIL_SENDING_ERROR = 500002,
}

/**
 * Authorization Error codes.
 */
export enum AuthorizationErrorCode {
  MISSING_AUTH_TOKEN = 403001,
  UNKNOWN_USER = 403002,
  UNAUTHORIZED = 403003,
  NOT_ACTIVATED = 403004,
}

/**
 * Validator Error codes.
 */
export enum ValidatorErrorCode {
  DEFAULT = 422000,
}

/**
 * Route Error codes.
 */
export enum RouteErrorCode {
  INVALID_REQUEST = 400000,
  // PROFILE_NOT_IDENTIFIED = 400001,
  PROFILE_CREDENTIALS_INVALID = 400002,
  REQUEST_TOKEN_INVALID = 400003,
}
