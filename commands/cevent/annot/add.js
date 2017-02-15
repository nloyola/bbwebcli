#!/usr/bin/env node

/* eslint no-console: "off" */

const _                    = require('lodash'),
      StudyAnnotAddCommand = require('../../../lib/StudyAnnotAddCommand'),
      CommandError         = require('../../../lib/errors/CommandError');

class CeventAddCommand extends StudyAnnotAddCommand {

  constructor() {
    super();
    this.commandHelp = 'add <study> <cevent> <name> [description]';
    this.description = 'adds an annotation to a collection event';
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

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables: */
/* mode: js2        */
/* End:             */
