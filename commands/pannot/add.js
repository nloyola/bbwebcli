#!/usr/bin/env node

/* eslint no-console: "off" */

const _            = require("lodash"),
      Command      = require('../../lib/Command'),
      CommandError = require('../../lib/errors/CommandError');

const VALUE_TYPES = {
  TEXT:            'text',
  NUMBER:          'number',
  DATE_TIME:       'datetime',
  SINGLE_SELECT:   'single-select',
  MULTIPLE_SELECT: 'multiple-select'
};

class PannotAddCommand extends Command {
  constructor() {
    super();
    this.commandHelp = 'add <study> <name> [description]';
    this.description = 'adds a participant annotation to a study';

    this.studies = [];
  }

  builder(yargs) {
    return yargs
      .alias('v', '--value-type')
      .nargs('v', 1)
      .choices('v', _.values(VALUE_TYPES))
      .describe('v', 'The value type for this annotation')
      .array('o')
      .alias('o', '--select-options')
      .describe('o', 'The options available for the single or multiple select')
      .boolean('r')
      .alias('r', '--required')
      .describe('r', 'If the annotation is required')
      .demandOption(['v']);
  }

  handleCommand() {
    var json = {};

    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('PannotAddCommand', 'invalid arguments'));
    }

    json.study = this.argv.study;
    return this.connection.getRequest('studies/?filter=name::' + this.argv.study)
      .then((pagedResult) => this.patientAnnotAddRequest(pagedResult))
      .then((json) => this.handleJsonReply(json));
  }

  patientAnnotAddRequest(pagedResult) {
    if (!pagedResult.data) {
      return Promise.reject(new CommandError('PannotAddCommand', 'no data in response'));
    }

    if (pagedResult.data.items.length <= 0) {
      return Promise.reject(
        new CommandError('PannotAddCommand', 'Study ' + this.argv.study + ' not found'));
    }

    const study = pagedResult.data.items[0],
          reqJson = {
            expectedVersion: study.version,
            name:            this.argv.name,
            required:        this.argv.required
          };

    if ((this.argv.valueType === VALUE_TYPES.SINGLE_SELECT) ||
        (this.argv.valueType === VALUE_TYPES.MULTIPLE_SELECT)) {
      reqJson.valueType = 'select';
      reqJson.maxValueCount = (this.argv.valueType === VALUE_TYPES.MULTIPLE_SELECT) ? 2 : 1;
      reqJson.options = this.argv.o;

      if (!this.argv.o) {
        return Promise.reject(new CommandError('PannotAddCommand', 'no options specified'));
      }
    } else {
      reqJson.valueType = this.argv.valueType;
      reqJson.options = [];
    }

    if (this.argv.description) {
      reqJson.description = this.argv.description;
    }

    return this.connection.postRequest('studies/pannottype/' + study.id, reqJson);
  }

  handleJsonReply(json) {
    console.log('Participant annotation added:', this.argv.name);
    return null;
  }

}

var command = new PannotAddCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
