#!/usr/bin/env node

/* eslint no-console: "off" */

const _            = require('lodash'),
      timeService  = require('../../lib/timeService'),
      Command      = require('../../lib/Command'),
      CommandError = require('../../lib/errors/CommandError');

const COMMAND = 'show <name>';

const DESCRIPTION = 'Displays a study\'s settings.';

const USAGE = `$0 study ${COMMAND}

${DESCRIPTION}

NAME is the name to assign to the study.`;

class StudyShowCommand extends Command {
  constructor() {
    super(USAGE);
  }

  handleCommand() {
    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('StudyShowCommand', 'invalid arguments'));
    }

    return this.connection.getRequest('studies/?filter=name::' + this.argv.name)
      .then((json) => this.studyResponse(json));
  }

  studyResponse(json) {
    if (json.data.items.length !== 1) {
      console.log('Study with name', this.argv.name, 'not found');
    } else {
      const study = json.data.items[0];
      var data = [
        [ 'name', study.name ],
        [ 'state', study.state ],
      ];

      if (study.description) {
        data.push([ 'description', study.description ]);
      }
      data.push([ 'time added', timeService.datetimeToDisplayString(study.timeAdded) ]);
      if (study.timeModified) {
        data.push([ 'time modified', timeService.datetimeToDisplayString(study.timeModified) ]);
      }

      if (study.annotationTypes) {
        const annotTypeData = _.map(study.annotationTypes, function (annotationType, index) {
          return [ 'annotation ' + (index + 1), annotationType.name ];
        });
        data = data.concat(annotTypeData);
      }
      console.log('\nStudy Information\n');
      console.table(['Attribute', 'Value'], data);
    }
  }

}

var command = new StudyShowCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2         */
/* End:              */
