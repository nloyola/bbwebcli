/* eslint no-console: "off" */

const logger          = require('./logger');
const chalk           = require('chalk');
const Config          = require('./Config');
const Connection      = require('./Connection');
const ConnectionError = require('./errors/ConnectionError');
const CommandError    = require('./errors/CommandError');

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
        logger.debug('argv', this.argv);

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
        logger.debug('Error: ' + err.command + ':' + err.message);
        console.error(chalk.red('Error:', err.message));
      })
      .catch((err) => {
        logger.info(err);
        console.error('Please check the status of the server. The connection was refused.' + err);
      });
  }

  handleCommand() {
    return Promise.reject(new CommandError('Command',
                                           'handleCommand: derived class should override this method'));
  }
}

module.exports = Command;
