#!/usr/bin/env node

/* eslint no-console: "off" */

const lib = require('../lib'),
      chalk  = require('chalk'),
      Command = require('../lib/Command');

class LoginCommand extends Command {

  constructor() {
    super();
    this.commandHelp = 'login';
    this.description = 'Logs into the server and saves a session for subsequent commands.';
  }

  handleCommand(argv, connParams) {
    if (argv._.length !== 1) {
      console.log('Error: invalid arguments');
      return;
    }

    lib.getPassword((password) => {
      var url;

      const credentials = {
        email: connParams.email,
        password: password
      };

      url = lib.getUrl(connParams) + 'users/login';
      this.postRequest(url, credentials, (json) => this.handleJsonReply(json));
    });
  }

  handleJsonReply(json) {
    if (json.status === 'success') {
      lib.writeSessionToken(json.data);
      console.log(chalk.yellow('Login successful'));
    } else  {
      console.log(chalk.red('Error:', json.message));
      lib.writeSessionToken('');
    }
  }

}

var command = new LoginCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = command.builder.bind(command);
exports.handler  = command.handler.bind(command);

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
