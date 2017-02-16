#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyStateCommand = require('../../lib/StudyStateCommand');

const COMMAND = 'unretire <name>';

const DESCRIPTION = 'Changes the state of a study to DISABLED.';

const USAGE = `$0 study ${COMMAND}

${DESCRIPTION}

NAME is the name of the study.`;

class StudyUnretireCommand extends StudyStateCommand {

  constructor() {
    super(USAGE);

    this.urlPart               = 'unretire';
    this.commandSuccessMessage = 'study was unretired and is now disabled';
    this.commandFailureMessage = 'Error: only unretired studies can be unretired';
    this.commandHelp           = 'unretire <name>';
    this.description           = 'Changes the state of a study to UNRETIRED.';
  }

}

var command = new StudyUnretireCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
