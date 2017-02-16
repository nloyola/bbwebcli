/* eslint no-console: "off" */

const winston         = require('winston'),
      chalk           = require('chalk'),
      Config          = require('./Config'),
      Connection      = require('./Connection'),
      ConnectionError = require('./errors/ConnectionError'),
      CommandError    = require('./errors/CommandError');

class Command {

  constructor(usage) {
    this.usage = usage;
  }

  builder(yargs) {
    return yargs.usage(this.usage);
  }

  handler(argv) {
    this.argv = argv;
    this.config = new Config(argv);
    return this.config.getConfig(argv)
      .then(() => {
        winston.log('debug', 'argv', this.argv);

        this.connection = new Connection(this.argv, this.config);
        return this.handleCommand();
      })
      .catch(ConnectionError, (err) => {
        if (err.status === 401) {
          console.log(chalk.red('Unauthorized'));
          console.log(chalk.red('Please login'));
        } else {
          console.log(chalk.red('response code:', err.status));
          console.log(chalk.red('message:', err.message));
        }
      })
      .catch(CommandError, (err) => {
        console.error(chalk.red('Error:', err.command + ':', err.message));
      })
      .catch((err) => {
        winston.info(err);
        console.error('Please check the status of the server. The connection was refused.');
      });
  }

}

module.exports = Command;
