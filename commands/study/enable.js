#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyStateCommand = require('../../lib/StudyStateCommand');

const COMMAND = 'enable <name>';

const DESCRIPTION = 'Changes the state of a study to ENABLED.';

const USAGE = `$0 study ${COMMAND}

${DESCRIPTION}

NAME is the name of the study.`;

class StudyEnableCommand extends StudyStateCommand {

  constructor() {
    super(USAGE);

    this.urlPart               = 'enable';
    this.commandSuccessMessage = 'study was enabled';
    this.commandFailureMessage = 'Error: only enabled studies can be enabled';
  }

}

var command = new StudyEnableCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
