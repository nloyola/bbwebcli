#!/usr/bin/env node

/* eslint no-console: "off" */

const chalk   = require('chalk'),
      Command = require('../lib/Command');

class LogoutCommand extends Command {

  constructor() {
    super();
    this.commandHelp = 'logout';
    this.description = 'Logs out of the server and deletes the session.';
  }

  handleCommand() {
    if (this.argv._.length !== 1) {
      return Promise.resolve('Error: invalid arguments');
    }

    return this.connection.postRequest('users/logout', null)
      .then((json) => this.handleJsonReply(json));
  }

  handleJsonReply(json) {
    if (json.status === 'success') {
      return this.config.writeSessionToken('')
        .then(() => console.log(chalk.yellow('Logout successful')));
    }

    return Promise.reject(json.message);
  }
}

var command = new LogoutCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
