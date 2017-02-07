#!/usr/bin/env node

/* eslint no-console: "off" */

const chalk   = require('chalk'),
      lib     = require('../lib'),
      Command = require('../lib/Command');

class LogoutCommand extends Command {

  constructor() {
    super();
    this.commandHelp = 'logout';
    this.description = 'Logs out of the server and deletes the session.';
  }

  handleCommand() {
    if (this.argv._.length !== 1) {
      console.log('Error: invalid arguments');
      return;
    }

    this.connection.postRequest('users/logout', null, (json) => this.handleJsonReply(json));
  }

  handleJsonReply(json) {
    this.connection.showConnectionParams();

    if (json.status === 'success') {
      this.config.writeSessionToken('');
      console.log(chalk.yellow('Logout successful'));
    } else  {
      console.error(chalk.red('Error:', json.message));
    }
  }
}

var command = new LogoutCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
