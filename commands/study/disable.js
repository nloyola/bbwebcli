#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyStateCommand = require('../../lib/StudyStateCommand');

const COMMAND = 'disable <name>';

const DESCRIPTION = 'Changes the state of a study to DISABLED.';

const USAGE = `$0 study ${COMMAND}

${DESCRIPTION}

NAME is the name of the study.`;

class StudyDisableCommand extends StudyStateCommand {

  constructor() {
    super(USAGE);

    this.urlPart               = 'disable';
    this.commandSuccessMessage = 'study was disabled';
    this.commandFailureMessage = 'Error: only enabled studies can be disabled';
  }

}

var command = new StudyDisableCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
