#!/usr/bin/env node

/* eslint no-console: "off" */

const prompt       = require('prompt'),
      chalk        = require('chalk'),
      Command      = require('../lib/Command'),
      CommandError = require('../lib/errors/CommandError'),
      LoginError   = require('../lib/errors/LoginError');

class LoginCommand extends Command {

  constructor() {
    super();
    this.commandHelp = 'login';
    this.description = 'Logs into the server and saves a session for subsequent commands.';
  }

  builder(yargs) {
    return yargs
      .boolean('n')
      .alias('n', '--new-connection')
      .describe('n', 'Ignore config.json and prompt for new connection parameters.');
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
      .catch(LoginError, () => {
        console.log('log in attempt failed with email', chalk.green(this.config.email));
        return null;
      });
  }

  handleJsonReply(token) {
    return this.config.writeSessionToken(token).then(() => {
      console.log(chalk.yellow('Login successful'));
    });
  }

}

var command = new LoginCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
