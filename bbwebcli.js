#!/usr/bin/env node

/* eslint no-unused-expressions: "off" */
/* eslint no-process-env: "off" */

const yargs   = require('yargs'),
      prompt  = require('prompt'),
      pjson   = require('./package.json'),
      winston = require('winston');

prompt.message = '';
prompt.delimiter = '';

winston.level = process.env.LOG_LEVEL;

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

/* Local Variables: */
/* mode: js2        */
/* End:             */
