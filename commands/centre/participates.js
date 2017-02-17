#!/usr/bin/env node

/* eslint no-console: "off" */

const CentreCommand = require('../../lib/CentreCommand'),
      CommandError  = require('../../lib/errors/CommandError');

const COMMAND = 'participates <centre> <study>';

const DESCRIPTION = 'Indicates that a centre participates in a study.';

const USAGE = `$0 centre ${COMMAND}

${DESCRIPTION}

CENTRE is the name of the centre and STUDY is the name of the study the centre participates with.`;

class CentreParticipatesCommand extends CentreCommand {

  constructor() {
    super(USAGE);
  }

  builder(yargs) {
    return super.builder(yargs)
      .usage(USAGE);
  }

  handleCommand() {
    this.centreName = this.argv.centre;
    super.handleCommand();
  }

  handleCentreCommand() {
    return this.connection.getRequest('studies/?filter=name::' + this.argv.study)
      .then((json) => this.studyResponse(json));
  }

  studyResponse(pagedResult) {
    if (pagedResult.data.items.length <= 0) {
      return Promise.reject(
        new CommandError('CentreParticipatesCommand', 'Study ' + this.argv.study + ' not found'));
    } else if (pagedResult.data.items.length > 1) {
      return Promise.reject(
        new CommandError('CentreParticipatesCommand',
                         'invalid response from server' + JSON.stringify(pagedResult)));
    }

    this.study = pagedResult.data.items[0];

    const json = {
      expectedVersion: this.centre.version,
      studyId:         this.study.id
    };

    return this.connection.postRequest('centres/studies/' + this.centre.id, json)
      .then((json) => this.handleJsonReply(json))
      .catch((json) => console.log('Error:', json.message));
  }

  handleJsonReply() {
    console.log('Study' + this.argv.study + 'added to centre ' + this.argv.centre);
  }

}

var command = new CentreParticipatesCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
