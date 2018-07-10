#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyCommand = require('../../lib/StudyCommand');

const COMMAND = 'add <name> <study>';

const DESCRIPTION = 'Adds a collection event to a study.';

const USAGE = `$0 cevent ${COMMAND}

${DESCRIPTION}

NAME is the name to assign to the collection event. STUDY is the name of the study to add the
collection event to`;

class CeventAddCommand extends StudyCommand {

  constructor() {
    super(USAGE);
  }

  builder(yargs) {
    return super.builder(yargs)
      .string('d')
      .nargs('d', 1)
      .alias('d', 'description')
      .describe('d', 'the description for this collection event')
      .boolean('r')
      .alias('r', 'recurring')
      .describe('r', 'If the collection event repeats');
  }

  handleCommand() {
    this.studyName = this.argv.study;
    return super.handleCommand();
  }

  handleStudyCommand(study) {
    const reqJson = {
      name:      this.argv.name,
      recurring: this.argv.recurring || false
    };

    if (this.argv.description) {
      reqJson.description = this.argv.description;
    }

    return this.connection.postRequest('studies/cetypes/' + study.id, reqJson)
      .then((json) => this.handleJsonReply(json));
  }

  handleJsonReply() {
    console.log('collection event added:', this.argv.name);
  }

}

var command = new CeventAddCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables: */
/* mode: js2        */
/* End:             */
