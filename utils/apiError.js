const { HTTP_STATUS } = require('../constants/common');

class ApiError extends Error {
  statusCode;

  /**
   * Constructor for ApiError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code for the error.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Returns an object that can be used as a JSON response to express.js
   * containing the error message and status code.
   *
   * @returns {object}
   * @property {number} statusCode - The HTTP status code for the error.
   * @property {boolean} success - Always false.
   * @property {string} message - The error message.
   * @property {null} data - Always null.
   */
  getResponse() {
    return {
      statusCode: this.statusCode,
      success: false,
      message: this.message,
      data: null
    };
  }
}

class UnauthorizedError extends ApiError {
  /**
   * Constructs an UnauthorizedError instance.
   *
   * @param {string} [message] - An optional error message providing additional information about the unauthorized error.
   */
  constructor(message) {
    super(`${message}`, HTTP_STATUS.UNAUTHORIZED);
  }
}

class BadRequestError extends ApiError {
  /**
   * Constructs a BadRequestError instance.
   *
   * @param {string} [message] - An optional error message providing additional information about the bad request error.
   */
  constructor(message) {
    super(`${message}`, HTTP_STATUS.BAD_REQUEST);
  }
}

class NotFoundError extends ApiError {
  /**
   * Constructs a NotFoundError instance.
   *
   * @param {string} [message] - An optional error message providing additional information about the not found error.
   */
  constructor(message) {
    super(`${message}`, HTTP_STATUS.NOT_FOUND);
  }
}

class ForbiddenError extends ApiError {
  /**
   * Constructs a ForbiddenError instance.
   *
   * @param {string} [message] - An optional error message providing additional information about the not found error.
   */
  constructor(message) {
    super(`${message}`, HTTP_STATUS.FORBIDDEN);
  }
}

class ServerError extends ApiError {
  /**
   * Constructs a ServerError instance.
   *
   * @param {string} [message] - An optional error message providing additional information about the not found error.
   */
  constructor(message) {
    super(` ${message}`, HTTP_STATUS.SERVER_ERROR);
  }
}

class ConflictError extends ApiError {
  /**
   * Constructs a ConflictError instance.
   *
   * @param {string} [message] - An optional error message providing additional information about the not found error.
   */
  constructor(message) {
    super(`${message}`, HTTP_STATUS.CONFLICT);
  }
}

class ValidationError extends ApiError {
  /**
   * Constructs a ValidationError instance.
   *
   * @param {string} [message] - An optional error message providing additional information about the not found error.
   */
  constructor(message) {
    super(` ${message}`, HTTP_STATUS.BAD_REQUEST);
  }
}

module.exports = {
  ApiError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ServerError,
  ConflictError,
  ValidationError
};
