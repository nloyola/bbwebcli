#!/usr/bin/env node

/* eslint no-console: "off" */

const _            = require('lodash'),
      sprintf      = require('sprintf-js').sprintf,
      querystring  = require('querystring'),
      timeService  = require('../../lib/timeService'),
      Command      = require('../../lib/Command'),
      CommandError = require('../../lib/errors/CommandError');

require('console.table');

class StudyListCommand extends Command {

  constructor() {
    super();
    this.commandHelp = 'list [filter]';
    this.description = 'Lists studies. A filter can be used to search.';

    this.studies = [];
  }

  handleCommand() {
    if (this.argv._.length > 1) {
      return Promise.reject(new CommandError('StudyListCommand', 'invalid arguments'));
    }

    if (this.argv.filter) {
      this.filter = this.argv.filter;
    }
    return this.getPage();
  }

  getPage(page = 1) {
    var opts = {
      sort: 'name',
      page: page,
      limit: 10
    };

    if (this.filter) {
      opts.filter = 'name:like:' + this.filter;
    }

    const url = sprintf('studies/?%s', querystring.stringify(opts));
    return this.connection.getRequest(url).then((json) => this.handleJsonReply(json));
  }

  handleJsonReply(json) {
    // accumulate data from the items in the paged result reply
    this.studies = this.studies.concat(_.map(json.data.items, function (study) {
      var attrs = _.pick(study, [ 'name', 'state', 'timeAdded', 'timeModified' ]);
      attrs.timeAdded = timeService.dateToDisplayString(attrs.timeAdded);
      if (attrs.timeModified) {
        attrs.timeModified = timeService.dateToDisplayString(attrs.timeModified);
      }
      return attrs;
    }));

    if (json.data.next) {
      // get the next page
      return this.getPage(json.data.next);
    } else {
      var tableHeading = '\nStudies';

      if (this.filter) {
        tableHeading += ', name filter: ' + this.filter;
      }

      console.table(tableHeading, this.studies);
      return Promise.resolve('done');
    }
  }

}

var command = new StudyListCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
