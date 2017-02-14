class LoginError extends Error {

  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'LoginError';
    Error.captureStackTrace(this, LoginError);
  }
}

module.exports = LoginError;
