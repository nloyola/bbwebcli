#!/usr/bin/env node

/* eslint no-console: "off" */

const _            = require('lodash'),
      StudyCommand = require('./StudyCommand'),
      CommandError = require('./errors/CommandError');

// base class for commands that operate on a study
class CeventCommand extends StudyCommand {

  handleStudyCommand(study) {
    this.study = study;
    return this.connection.getRequest('studies/cetypes/' + study.slug + '?filter=name::' + this.argv.cevent)
      .then((reply) => {
        var cevent = _.find(reply.data.items, (cevent) => cevent.name === this.argv.cevent);

        if (!cevent) {
          return Promise.reject(new CommandError(
            'CeventAddCommand',
            'cevent not found: ' + this.argv.cevent));
        }

        return this.handleCeventReply(cevent);
      });
  }

  handleCeventReply() {
    return Promise.reject(new CommandError(
      'CeventCommand',
      'handleCeventReply: derived class should override this method'));
  }
}

module.exports = CeventCommand;

/* Local Variables:  */
/* mode: js2         */
/* End:              */
