#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyStateCommand = require('../../lib/StudyStateCommand');

class StudyEnableCommand extends StudyStateCommand {

  constructor() {
    super();
    this.commandHelp = 'enable <name>';
    this.description = 'Changes the state of a study to ENABLED.';

    this.studies = [];
  }

  studyResponse(json) {
    const study = json.data.items[0],
          reqJson = { expectedVersion: study.version };

    return this.connection.postRequest('studies/enable/' + study.id, reqJson)
      .then((json) => {
        console.log('---->', json);
      })
      .catch((err) => {
        if (err.message.includes('study not disabled')) {
          console.log('Error: only disabled studies can be enabled: ' + study.name);
          return;
        }
        console.log('Error:', err.message);
      });
  }

}

var command = new StudyEnableCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
