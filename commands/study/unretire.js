#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyStateCommand = require('../../lib/StudyStateCommand');

class StudyUnretireCommand extends StudyStateCommand {

  constructor() {
    super();

    this.urlPart               = 'unretire';
    this.commandSuccessMessage = 'study was unretired and is now disabled';
    this.commandFailureMessage = 'Error: only unretired studies can be unretired';
    this.commandHelp           = 'unretire <name>';
    this.description           = 'Changes the state of a study to UNRETIRED.';
  }

}

var command = new StudyUnretireCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
