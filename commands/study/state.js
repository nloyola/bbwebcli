#!/usr/bin/env node

/* eslint no-console: "off" */

const Command      = require('../../lib/Command'),
      CommandError = require('../../lib/errors/CommandError');

const validCommands = [ 'enable', 'disable', 'retire' ];

class StudyStateCommand extends Command {

  constructor() {
    super();
    this.commandHelp = 'state <state_command> <name>';
    this.description = 'Changes the state of a study. State command can be one of: enable, disable, retire.';

    this.studies = [];
  }

  handleCommand() {
    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('StudyStateCommand', 'invalid arguments'));
    }

    if (!validCommands.includes(this.argv.state_command)) {
      return Promise.reject(new CommandError('StudyStateCommand', 'invalid state command'));
    }

    // get study first
    return this.connection.getRequest('studies/?filter=name::' + this.argv.name)
      .then((json) => this.studyResponse(json));
  }

  studyResponse(json) {
    console.log('studyResponse', json.data.items);
    return null;
  }

}

var command = new StudyStateCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
