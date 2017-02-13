class ConnectionError extends Error {

  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
    this.name = 'ConnectionError';
    Error.captureStackTrace(this, ConnectionError);
  }
}

module.exports = ConnectionError;
