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

  handleCommand(argv, connParams) {
    var url;

    if (argv._.length !== 1) {
      console.log('Error: invalid arguments');
      return;
    }

    url = lib.getUrl(connParams) + 'users/logout';
    this.postRequest(url, null, (json) => this.handleJsonReply(json));
  }

  handleJsonReply(json) {
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
exports.builder  = command.builder.bind(command);
exports.handler  = command.handler.bind(command);

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
