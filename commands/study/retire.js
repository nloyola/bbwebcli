#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyStateCommand = require('../../lib/StudyStateCommand');

const COMMAND = 'retire <name>';

const DESCRIPTION = 'Changes the state of a study to RETIRED.';

const USAGE = `$0 study ${COMMAND}

${DESCRIPTION}

NAME is the name of the study.`;

class StudyRetireCommand extends StudyStateCommand {

  constructor() {
    super(USAGE);

    this.urlPart               = 'retire';
    this.commandSuccessMessage = 'study was retired';
    this.commandFailureMessage = 'Error: only retired studies can be retired';
    this.commandHelp           = 'retire <name>';
    this.description           = 'Changes the state of a study to RETIRED.';
  }

}

var command = new StudyRetireCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
