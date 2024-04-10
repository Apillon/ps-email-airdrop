import {
  AuthorizationErrorCode,
  SystemErrorCode,
  ValidatorErrorCode,
  RouteErrorCode,
} from './values';

/**
 * Message codes.
 */
export default (code) => {
  const customMessages = {
    [RouteErrorCode.INVALID_REQUEST]: 'INVALID REQUEST',
  };

  return (
    customMessages[code] ||
    AuthorizationErrorCode[code] ||
    SystemErrorCode[code] ||
    ValidatorErrorCode[code] ||
    RouteErrorCode[code] ||
    'UNKNOWN_ERROR'
  );
};
