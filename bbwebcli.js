#!/usr/bin/env node

// -*-:mode: js2-mode; -*-

/* eslint no-unused-expressions: "off" */

const yargs  = require('yargs'),
      pjson  = require('./package.json');

yargs
  .usage('$0 <command> [args]')
  .version(() => pjson.version)
  .commandDir('commands')
  .boolean('n')
  .alias('n', '--new-connection')
  .describe('n', 'Ignore config.json and prompt for new connection parameters.')
  .help('help')
  .alias('h', 'help')
  .argv;
