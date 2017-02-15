#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyCommand = require('../../lib/StudyCommand');

class CeventAddCommand extends StudyCommand {
  constructor() {
    super();
    this.commandHelp = 'add <study> <name> [description]';
    this.description = 'adds a collection event to a study';
  }

  builder(yargs) {
    return yargs
      .boolean('r')
      .alias('r', '--recurring')
      .describe('r', 'If the collection event repeats');
  }

  handleCommand() {
    this.studyName = this.argv.study;
    return super.handleCommand();
  }

  handleStudyCommand(study) {
    const reqJson = {
      name:      this.argv.name,
      recurring: this.argv.recurring
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

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables: */
/* mode: js2        */
/* End:             */
