#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyStateCommand = require('../../lib/StudyStateCommand');

class StudyRetireCommand extends StudyStateCommand {

  constructor() {
    super();

    this.urlPart               = 'retire';
    this.commandSuccessMessage = 'study was retired';
    this.commandFailureMessage = 'Error: only retired studies can be retired';
    this.commandHelp           = 'retire <name>';
    this.description           = 'Changes the state of a study to RETIRED.';
  }

}

var command = new StudyRetireCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
