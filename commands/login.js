#!/usr/bin/env node

/* eslint no-console: "off" */

const prompt       = require('prompt'),
      chalk        = require('chalk'),
      Command      = require('../lib/Command'),
      CommandError = require('../lib/errors/CommandError');

class LoginCommand extends Command {

  constructor() {
    super();
    this.commandHelp = 'login';
    this.description = 'Logs into the server and saves a session for subsequent commands.';
  }

  handleCommand() {
    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('LoginCommand', 'invalid arguments'));
    }

    this.connection.showConnectionParams();

    const promptProps = [{
      name: 'password',
      hidden: true,
      message: 'Please enter your password:'
    }];

    return prompt.getAsync(promptProps)
      .then((result) => {
        const credentials = {
          email: this.config.email,
          password: result.password
        };

        return this.connection.postRequest('users/login', credentials);
      })
      .then((json) => this.handleJsonReply(json))
      .catch(() => console.log('log in attempt failed with email', chalk.green(this.config.email)));
  }

  handleJsonReply(json) {
    var token = '';

    if (json.status === 'success') {
      token = json.data;
    }

    this.config.writeSessionToken(token).then(() => {
      if (token) {
        console.log(chalk.yellow('Login successful'));
      } else {
        console.log(chalk.red('Error:', json.message));
      }
    });
    return null;
  }

}

var command = new LoginCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
