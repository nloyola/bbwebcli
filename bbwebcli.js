#!/usr/bin/env node

/* eslint no-unused-expressions: "off" */
/* eslint no-process-env: "off" */

const yargs   = require('yargs'),
      prompt  = require('prompt'),
      pjson   = require('./package.json'),
      winston = require('winston');

// dont' like Prompt's default prompts, set them to blank instead
prompt.message = '';
prompt.delimiter = '';

winston.level = process.env.LOG_LEVEL;

yargs
  .usage('$0 <command> [args]')
  .version(() => pjson.version)
  .commandDir('commands')
  .help('help')
  .alias('h', 'help')
  .wrap(yargs.terminalWidth())
  .argv;

/* Local Variables: */
/* mode: js2        */
/* End:             */
