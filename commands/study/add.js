#!/usr/bin/env node

/* eslint no-console: "off" */

const Command      = require('../../lib/Command'),
      CommandError = require('../../lib/errors/CommandError');

class StudyAddCommand extends Command {
  constructor() {
    super();
    this.commandHelp = 'add <name> [description]';
    this.description = 'adds a study';

    this.studies = [];
  }

  handleCommand() {
    var json = {};

    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('StudyAddCommand', 'invalid arguments'));
    }

    json.name = this.argv.name;
    if (this.argv.description) {
      json.description = this.argv.description;
    }

    return this.connection.postRequest('studies/', json)
      .then((json) => this.handleJsonReply(json))
      .catch((json) => console.log('Error:', json.message));
  }

  handleJsonReply(json) {
    console.log('Study', json.data.name, 'added');
    return null;
  }

}

var command = new StudyAddCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
