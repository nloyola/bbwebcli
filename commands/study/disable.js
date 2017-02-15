#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyStateCommand = require('../../lib/StudyStateCommand');

class StudyDisableCommand extends StudyStateCommand {

  constructor() {
    super();

    this.urlPart               = 'disable';
    this.commandSuccessMessage = 'study was disabled';
    this.commandFailureMessage = 'Error: only enabled studies can be disabled';
    this.commandHelp           = 'disable <name>';
    this.description           = 'Changes the state of a study to DISABLED.';

    this.studies = [];
  }

}

var command = new StudyDisableCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
