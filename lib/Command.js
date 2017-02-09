/* eslint no-console: "off" */

const Promise    = require('bluebird'),
      Config     = require('./Config'),
      Connection = require('./Connection');

class Command {

  constructor() {
    this.commandHelp = '*** command help ***';
    this.description = '*** command description ***';
  }

  builder() {
  }

  handler(argv) {
    this.argv = argv;
    this.config = new Config(argv);
    return this.config.getConfig(argv)
      .then(() => {
        this.connection = new Connection(this.argv, this.config);
        return this.handleCommand();
      })
      .catch((err) => new Error('Command:', err));
  }

}

module.exports = Command;
