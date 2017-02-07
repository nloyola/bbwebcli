#!/usr/bin/env node

// -*-:mode: js2-mode; -*-

/* eslint no-console: "off" */

const fetch = require('node-fetch'),
      lib = require('../../lib'),
      Command     = require('../../lib/Command');

class StudyAddCommand extends Command {
  constructor() {
    super();
    this.commandHelp = 'add <name> [description]';
    this.description = 'adds a study';

    this.studies = [];
  }

  handleCommand() {
  const { name, description = ''} = this.argv;
  if ((this.argv.length < 1) || (this.argv.length > 2)) {
    console.log('Error: invalid arguments');
    return;
  }

  console.log('name: "%s"', name);
  console.log('description: "%s"', description);
  }

}

var command = new StudyAddCommand();

exports.command  = command.commandHelp;
exports.describe = command.description;
exports.builder  = () => command.builder();
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
