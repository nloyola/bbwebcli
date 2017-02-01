#!/usr/bin/env node

// -*-:mode: js2-mode; -*-

/* eslint no-unused-expressions: "off" */

const yargs  = require('yargs'),
      pjson  = require('./package.json');

yargs
  .usage('$0 <command> [args]')
  .version(() => pjson.version)
  .commandDir('commands')
  .boolean('c')
  .alias('c', '--config-from-file')
  .describe('c', 'Load connection parameters from config.json')
  .help('help')
  .alias('h', 'help')
  .argv;
