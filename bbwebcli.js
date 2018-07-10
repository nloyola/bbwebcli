#!/usr/bin/env node

/* eslint no-unused-expressions: "off" */
/* eslint no-process-env: "off" */

const yargs   = require('yargs');
const prompt  = require('prompt');
const pjson   = require('./package.json');

// dont' like Prompt's default prompts, set them to blank instead
prompt.message = '';
prompt.delimiter = '';

yargs
  .usage('$0 <command> [args]')
  .version(pjson.version)
  .commandDir('commands')
  .help('help')
  .alias('h', 'help')
  .wrap(yargs.terminalWidth())
  .argv;

/* Local Variables: */
/* mode: js2        */
/* End:             */
