#!/usr/bin/env node

/* eslint no-console: "off" */

const Command     = require('../../lib/Command');

class StudyAddCommand extends Command {
  constructor() {
    super();
    this.commandHelp = 'add <name> [description]';
    this.description = 'adds a study';

    this.studies = [];
  }

  handleCommand() {
    var json = {};

    if ((this.argv.length < 1) || (this.argv.length > 2)) {
      return Promise.resolve('Error: invalid arguments');
    }

    json.name = this.argv.name;
    if (this.argv.description) {
      json.description = this.argv.description;
    }

    return this.connection.postRequest('studies/', json)
      .then((json) => this.handleJsonReply(json))
      .catch((json) => console.log('Error:', json));
  }

  handleJsonReply(json) {
    console.log('Study', json.data.name, 'added');
    return Promise.resolve('done');
  }

}

var command = new StudyAddCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
