#!/usr/bin/env node

/* eslint-env es6 */
/* eslint no-sync: "off" */
/* eslint no-console: "off" */
/* global process */

(function () {
  'use strict';

  const program = require('commander');

  const cliFunction = (req, optional) => {
    console.log('command: %s', req);
    if (optional) {
      optional.forEach(function (opt) {
        console.log('User passed optional arguments: %s', opt);
      });
    }
  };

  program
    .version('0.0.1')
    .command('study <command>', 'commands related to a study')
    .parse(process.argv);

})();
