#!/usr/bin/env node

/* eslint no-console: "off" */

const Command      = require('../../lib/Command'),
      CommandError = require('../../lib/errors/CommandError');

const COMMAND = 'add <name>';

const DESCRIPTION = 'Adds a study.';

const USAGE = `$0 study ${COMMAND}

${DESCRIPTION}

NAME is the name to assign to the study.`;

class StudyAddCommand extends Command {

  constructor() {
    super(USAGE);
  }

  builder(yargs) {
    return super.builder(yargs)
      .string('d')
      .nargs('d', 1)
      .alias('d', 'description')
      .describe('d', 'the description for this centre');
  }

  handleCommand() {
    var json = {};

    if (this.argv._.length > 2) {
      return Promise.reject(new CommandError('StudyAddCommand', 'invalid arguments'));
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
  }

}

var command = new StudyAddCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
