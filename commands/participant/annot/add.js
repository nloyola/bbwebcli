#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyAnnotAddCommand = require('../../../lib/StudyAnnotAddCommand');

const COMMAND = 'add <name> <study>';

const DESCRIPTION = 'Adds a participant annotation to a study.';

const USAGE = `$0 cevent ${COMMAND}

${DESCRIPTION}

NAME is the name to assign to the annotation. STUDY is the name of the study the collection event
belongs to. STUDY must already exist.`;

class PannotAddCommand extends StudyAnnotAddCommand {

  constructor() {
    super(USAGE);
  }

  builder(yargs) {
    return super.builder(yargs)
      .string('d')
      .nargs('d', 1)
      .alias('d', 'description')
      .describe('d', 'the description for this specimen');
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

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables: */
/* mode: js2        */
/* End:             */
