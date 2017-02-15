#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyAnnotAddCommand = require('../../lib/StudyAnnotAddCommand');

class PannotAddCommand extends StudyAnnotAddCommand {

  constructor() {
    super('studies/pannottype/');
    this.commandHelp = 'add <study> <name> [description]';
    this.description = 'adds a participant annotation to a study';
  }

  handleStudyCommand(study) {
    var reqJson = this.createStudyAnnotation();

    reqJson.expectedVersion = study.version;

    return this.connection.postRequest('studies/pannottype/' + study.id, reqJson)
      .then((json) => this.handleJsonReply(json));
  }

  handleJsonReply() {
    console.log('Participant annotation added:', this.argv.name);
  }

}

var command = new PannotAddCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables: */
/* mode: js2        */
/* End:             */
