#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyStateCommand = require('../../lib/StudyStateCommand');

class StudyEnableCommand extends StudyStateCommand {

  constructor() {
    super();

    this.urlPart               = 'enable';
    this.commandSuccessMessage = 'study was enabled';
    this.commandFailureMessage = 'Error: only enabled studies can be enabled';
    this.commandHelp = 'enable <name>';
    this.description = 'Changes the state of a study to ENABLED.';

    this.studies = [];
  }

}

var command = new StudyEnableCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
