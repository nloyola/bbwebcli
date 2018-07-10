#!/usr/bin/env node

/* eslint no-console: "off" */

const Command      = require('./Command'),
      CommandError = require('./errors/CommandError');

// base class for commands that operate on a centre
class CentreCommand extends Command {

  handleCommand() {
    return this.connection.getRequest('centres/search?filter=name::' + this.centreName)
      .then((json) => this.handlePagedResult(json));
  }

  handlePagedResult(pagedResult) {
    if (!pagedResult.data) {
      return Promise.reject(new CommandError('CentreCommand', 'no data in response'));
    }

    if (pagedResult.data.items.length <= 0) {
      return Promise.reject(
        new CommandError('CentreCommand', 'Centre ' + this.argv.centre + ' not found'));
    } else if (pagedResult.data.items.length > 1) {
      return Promise.reject(
        new CommandError('CentreCommand', 'invalid response from server' + JSON.stringify(pagedResult)));
    }

    this.centre = pagedResult.data.items[0];
    return this.handleCentreCommand();
  }

  handleCentreCommand() {
    return Promise.reject(new CommandError('CentreCommand',
                                           'handleCentreCommand: derived class should override this method'));
  }
}

module.exports = CentreCommand;

/* Local Variables:  */
/* mode: js2         */
/* End:              */
