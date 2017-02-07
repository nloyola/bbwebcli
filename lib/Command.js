/* eslint no-console: "off" */

const Config     = require('./Config'),
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
    this.config.getConfig(argv, (config) => this.configRetrieved(config));
  }

  configRetrieved(config) {
    this.connection = new Connection(this.argv, this.config);
    //lib.showConnectionParams();
    this.handleCommand(this.argv, config);
  }

}

module.exports = Command;
