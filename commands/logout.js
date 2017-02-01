#!/usr/bin/env node

// -*-:mode: js2-mode; -*-

/* eslint no-console: "off" */

const fetch = require('node-fetch'),
      prompt = require('prompt'),
      chalk  = require('chalk'),
      lib = require('../lib');

exports.command = 'logout';
exports.describe = 'Logs out of the server and deletes the session.';
exports.builder = function() {};
exports.handler = function(argv) {
  if (argv._.length !== 1) {
    console.log('Error: invalid arguments');
    return;
  }

  lib.getConnectionParams(argv, doRequest);
};

function doRequest(connParams) {
  fetch(lib.getUrl(connParams) + 'users/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': connParams.sessionToken,
      'Cookie': 'XSRF-TOKEN=' + connParams.sessionToken
    }
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.status === 'success') {
        lib.writeSessionToken('');
        console.log(chalk.yellow('Logout successful'));
      } else  {
        console.error(chalk.red('Error:', json.message));
      }
    })
    .catch((err) => {
      console.error(chalk.red(err));
    });
}
