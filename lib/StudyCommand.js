#!/usr/bin/env node

/* eslint no-console: "off" */

const Command      = require('./Command'),
      CommandError = require('./errors/CommandError');

// base class for commands that operate on a study
class StudyCommand extends Command {

  handleCommand() {
    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('StudyCommand', 'invalid arguments'));
    }

    return this.connection.getRequest('studies/?filter=name::' + this.studyName)
      .then((json) => this.handlePagedResult(json));
  }

  handlePagedResult(pagedResult) {
    if (!pagedResult.data) {
      return Promise.reject(new CommandError('StudyCommand', 'no data in response'));
    }

    if (pagedResult.data.items.length <= 0) {
      return Promise.reject(
        new CommandError('StudyCommand', 'Study ' + this.argv.study + ' not found'));
    } else if (pagedResult.data.items.length > 1) {
      return Promise.reject(
        new CommandError('StudyCommand', 'invalid response from server' + JSON.stringify(pagedResult)));
    }

    return this.handleStudyCommand(pagedResult.data.items[0]);
  }

  handleStudyCommand() {
    return Promise.reject(new CommandError('StudyCommand',
                                           'handleStudyCommand: derived class should override this method'));
  }
}

module.exports = StudyCommand;

/* Local Variables:  */
/* mode: js2         */
/* End:              */
