#!/usr/bin/env node

/* eslint no-console: "off" */

const StudyCommand = require('./StudyCommand');

// base class for commands to change state on a study
class StudyStateCommand extends StudyCommand {

  handleCommand() {
    this.studyName = this.argv.name;
    return super.handleCommand();
  }

  handleStudyCommand(study) {
    const reqJson = { expectedVersion: study.version };

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

/* Local Variables: */
/* mode: js2        */
/* End:             */
