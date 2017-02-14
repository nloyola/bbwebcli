#!/usr/bin/env node

/* eslint no-console: "off" */

const winston      = require('winston'),
      Command      = require('./Command'),
      CommandError = require('./errors/CommandError');

// base class for commands to change state on a study
class StudyStateCommand extends Command {

  handleCommand() {
    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('StudyStateCommand', 'invalid arguments'));
    }

    return this.firstStudy();
  }

  firstStudy() {
    return this.connection.getRequest('studies/?filter=name::' + this.argv.name)
      .then((json) => this.studyResponse(json))
      .catch((json) => console.log('Error:', json.message));
  }

  studyResponse(json) {
    const study = json.data.items[0],
          reqJson = { expectedVersion: study.version };

    return this.connection.postRequest('studies/' + this.urlPart + '/' + study.id, reqJson)
      .then(() => {
        console.log(this.commandSuccessMessage, ':', study.name);
      })
      .catch((err) => {
        if (err.message.includes('study not')) {
          console.log(this.commandFailureMessage, ':', study.name);
          return;
        }
        console.log('Error:', err.message);
      });
  }
}

module.exports = StudyStateCommand;

/* Local Variables:  */
/* mode: js2    */
/* End:              */
