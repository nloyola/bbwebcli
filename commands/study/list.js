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

  handleCommand(argv, connParams) {
    if (argv.length > 2) {
      console.log('Error: invalid arguments');
      return;
    }

    this.filter = this.argv.filter;
    console.log('filter: "%s"', this.filter);

    this.baseUrl = lib.getUrl(connParams) + 'studies/';
    this.getPage({ filter: this.filter });
  }

  getPage({ filter = '', sort = 'name', page = 1, limit = 10}) {
    var obj = { sort: sort,
                page: page,
                limit: limit
              },
        url;

    if (filter.length > 0) {
      obj.filter = 'name:like:' + filter;
    }

    url = sprintf('%s?%s', this.baseUrl, querystring.stringify(obj));
    this.getRequest(url, (json) => this.handleJsonReply(json));
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
      this.getPage({ filter: this.filter, page: json.data.next });
    } else {
      console.log('\nSTUDIES:\n');
      console.table(this.studies);
    }
  }

}

var command = new StudyListCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = command.builder.bind(command);
exports.handler  = command.handler.bind(command);

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
