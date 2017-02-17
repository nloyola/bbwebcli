#!/usr/bin/env node

/* eslint no-console: "off" */

const Command      = require('../../lib/Command'),
      CommandError = require('../../lib/errors/CommandError');

const COMMAND = 'add <name>';

const DESCRIPTION = 'Adds a centre.';

const USAGE = `$0 centre ${COMMAND}

${DESCRIPTION}

NAME is the name to assign to the centre.`;

class CentreAddCommand extends Command {

  constructor() {
    super(USAGE);
  }

  builder(yargs) {
    return super.builder(yargs)
      .usage(USAGE)
      .string('d')
      .nargs('d', 1)
      .alias('d', 'description')
      .describe('d', 'the description for this centre');
  }

  handleCommand() {
    var json = {};

    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('CentreAddCommand', 'invalid arguments'));
    }

    json.name = this.argv.name;
    if (this.argv.description) {
      json.description = this.argv.description;
    }

    return this.connection.postRequest('centres/', json)
      .then((json) => this.handleJsonReply(json))
      .catch((json) => console.log('Error:', json.message));
  }

  handleJsonReply(json) {
    console.log('Centre', json.data.name, 'added');
  }

}

var command = new CentreAddCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
