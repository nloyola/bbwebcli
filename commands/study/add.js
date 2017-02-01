#!/usr/bin/env node

// -*-:mode: js2-mode; -*-

/* eslint no-console: "off" */

const fetch = require('node-fetch'),
      lib = require('../../lib');

exports.command = 'add <name> [description]';
exports.describe = 'adds a study';
exports.builder = function() {};
exports.handler = function(argv) {
  const { name, description = ''} = argv;
  if ((argv.length < 1) || (argv.length > 2)) {
    console.log('Error: invalid arguments');
    return;
  }

  console.log('name: "%s"', name);
  console.log('description: "%s"', description);

  lib.getConnectionParams(doRequest);
};

function doRequest(result) {
  console.log('prompt result: ', result);
  return result;
}
