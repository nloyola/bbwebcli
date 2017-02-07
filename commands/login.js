#!/usr/bin/env node

/* eslint no-console: "off" */

const lib     = require('../lib'),
      prompt  = require('prompt'),
      chalk   = require('chalk'),
      Command = require('../lib/Command');

class LoginCommand extends Command {

  constructor() {
    super();
    this.commandHelp = 'login';
    this.description = 'Logs into the server and saves a session for subsequent commands.';
  }

  handleCommand() {
    if (this.argv._.length !== 1) {
      console.log('Error: invalid arguments');
      return;
    }

    this.getPassword((password) => {
      const credentials = {
        email: this.config.email,
        password: password
      };

      this.connection.postRequest('users/login', credentials, (json) => this.handleJsonReply(json));
    });
  }

  handleJsonReply(json) {
    this.connection.showConnectionParams();

    if (json.status === 'success') {
      this.config.writeSessionToken(json.data);
      console.log(chalk.yellow('Login successful'));
    } else  {
      console.log(chalk.red('Error:', json.message));
      this.config.writeSessionToken('');
    }
  }

  getPassword(onResultFn) {
    const schema = {
      properties: {
        password: {
          hidden: true
        }
      }
    };

    prompt.get(schema, (err, result) => {
      if (err) { return onPromptErr(err); }
      return onResultFn(result.password);
    });

    function onPromptErr(err) {
      console.log(err);
      return 1;
    }
  }

}

var command = new LoginCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
