#!/usr/bin/env node

// -*-:mode: js2-mode; -*-

/* eslint no-console: "off" */

const fetch = require('node-fetch'),
      lib = require('../lib'),
      chalk  = require('chalk');

exports.command = 'login';
exports.describe = 'Logs into the server and saves a session for subsequent commands.';
exports.builder = function() {};
exports.handler = function(argv) {
  if (argv._.length !== 1) {
    console.log('Error: invalid arguments');
    return;
  }

  lib.getConnectionParams(argv, doRequest);
};

function doRequest(connParams) {
  lib.showConnectionParams();

  lib.getPassword((password) => {
    const credentials = {
      email: connParams.email,
      password: password
    };

    fetch(lib.getUrl(connParams) + 'users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
      .then((res) => res.json())
      .then((json) => {
        if (json) {
            if (json.status === 'success') {
              lib.writeSessionToken(json.data);
              console.log(chalk.yellow('Login successful'));
            } else  {
              console.log(chalk.red('Error:', json.message));
              lib.writeSessionToken('');
            }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
