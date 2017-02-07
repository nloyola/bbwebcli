#!/usr/bin/env node

/* eslint no-console: "off" */

const _           = require('lodash'),
      sprintf     = require('sprintf-js').sprintf,
      querystring = require('querystring'),
      lib         = require('../../lib'),
      Command     = require('../../lib/Command');

require('console.table');

class StudyListCommand extends Command {

  constructor() {
    super();
    this.commandHelp = 'list [filter]';
    this.description = 'Lists studies. A filter can be used to search.';

    this.studies = [];
  }

  handleCommand() {
    if (this.argv._.length > 2) {
      console.log('Error: invalid arguments');
      return;
    }

    if (this.argv.filter) {
      this.filter = this.argv.filter;
    }
    this.getPage();
  }

  getPage(page = 1) {
    var obj = { sort: 'name',
                page: page,
                limit: 10
              },
        url;

    if (this.filter) {
      obj.filter = 'name:like:' + this.filter;
    }

    url = sprintf('studies/?%s', querystring.stringify(obj));
    this.connection.getRequest(url, (json) => this.handleJsonReply(json));
  }

  handleJsonReply(json) {
    // accumulate data from the items in the paged result reply
    this.studies = this.studies.concat(_.map(json.data.items, function (study) {
      var attrs = _.pick(study, [ 'name', 'state', 'timeAdded', 'timeModified' ]);
      attrs.timeAdded = lib.dateToDisplayString(attrs.timeAdded);
      if (attrs.timeModified) {
        attrs.timeModified = lib.dateToDisplayString(attrs.timeModified);
      }
      return attrs;
    }));

    if (json.data.next) {
      this.getPage(json.data.next);
    } else {
      var tableHeading = '\nStudies';

      if (this.filter) {
        tableHeading += ', name filter: ' + this.filter;
      }

      this.connection.showConnectionParams();
      console.table(tableHeading, this.studies);
    }
  }

}

var command = new StudyListCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
