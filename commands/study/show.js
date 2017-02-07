#!/usr/bin/env node

/* eslint no-console: "off" */

const _           = require('lodash'),
      timeService = require('../../lib/timeService'),
      Command     = require('../../lib/Command');

class StudyShowCommand extends Command {
  constructor() {
    super();
    this.commandHelp = 'show <name>';
    this.description = 'displays the settings for a study';
  }

  handleCommand() {
    if (this.argv.length > 1) {
      return Promise.resolve('Error: invalid arguments');
    }

    return this.connection.getRequest('studies/?filter=name::' + this.argv.name)
      .then((json) => this.studyResponse(json))
      .catch((json) => console.log('Error:', json));
  }

  studyResponse(json) {
    if (json.data.items.length !== 1) {
      console.log('Study with name', this.argv.name, 'not found');
    } else {
      const study = json.data.items[0];
      console.log(study);
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
      console.table(['Attribute', 'Value'], data);

      if (study.annotationTypes) {
        var annotTypeData = _.map(study.annotationTypes, function (annotationType) {
          return [ 'name', annotationType.name ];
        });
        console.log('Patient Annotations');
        console.table(['Attribute', 'Value'], annotTypeData);
      }
    }
    return Promise.resolve('done');
  }

}

var command = new StudyShowCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
