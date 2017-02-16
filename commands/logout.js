#!/usr/bin/env node

/* eslint no-console: "off" */

const chalk        = require('chalk'),
      Command      = require('../lib/Command'),
      CommandError = require('../lib/errors/CommandError');

const COMMAND = 'logout';

const DESCRIPTION = 'Logs out of the server and deletes the session.';

const USAGE = `$0 ${COMMAND}

${DESCRIPTION}`;

class LogoutCommand extends Command {

  constructor() {
    super(USAGE);
  }

  handleCommand() {
    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('LogoutCommand', 'invalid arguments'));
    }

    return this.connection.postRequest('users/logout', null)
      .then((json) => this.handleJsonReply(json));
  }

  handleJsonReply(json) {
    if (json.status === 'success') {
      return this.config.writeSessionToken('')
        .then(() => console.log(chalk.yellow('Logout successful')));
    }

    return Promise.reject(new CommandError('LogoutCommand', json.message));
  }
}

var command = new LogoutCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
