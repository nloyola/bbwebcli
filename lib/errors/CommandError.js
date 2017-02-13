class CommandError extends Error {

  constructor(command, message) {
    super(message);
    this.command = command;
    this.message = message;
    this.name = 'CommandError';
    Error.captureStackTrace(this, CommandError);
  }
}

module.exports = CommandError;
