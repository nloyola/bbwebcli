#!/usr/bin/env node

/* eslint no-console: "off" */

const _                    = require('lodash'),
      StudyAnnotAddCommand = require('../../../lib/StudyAnnotAddCommand'),
      CommandError         = require('../../../lib/errors/CommandError');

const COMMAND = 'add <name> <cevent> <study>';

const DESCRIPTION = 'Adds an annotation to a collection event.';

const USAGE = `$0 cevent annot ${COMMAND}

${DESCRIPTION}

NAME is the name to assign to the annotation. CEVENT is the name of the collection event to add this
annotation to. STUDY is the name of the study the collection event belongs to. CEVENT and STUDY must
already exist.`;

class CeventAddCommand extends StudyAnnotAddCommand {

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
    this.study = study;
    return this.connection.getRequest('studies/cetypes/' + study.id)
      .then((json) => this.handleCeventReply(json.data));
  }

  handleCeventReply(cevents) {
    var cevent = _.find(cevents, (cevent) => cevent.name === this.argv.cevent);

    if (!cevent) {
      return Promise.reject(new CommandError('CeventAddCommand', 'cevent not found: ' + this.argv.cevent));
    }

    var reqJson = this.createStudyAnnotation();

    reqJson.studyId         = this.study.id;
    reqJson.expectedVersion = cevent.version;

    return this.connection.postRequest('studies/cetypes/annottype/' + cevent.id, reqJson)
      .then((json) => this.handleJsonReply(json));
  }

  handleJsonReply() {
    console.log('annotation added to collection event:', this.argv.name);
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
