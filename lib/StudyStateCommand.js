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

  handleStateReply(json) {
    winston.info('handleStateReply:', json);
  }
}

module.exports = StudyStateCommand;

/* Local Variables:  */
/* mode: js2    */
/* End:              */
