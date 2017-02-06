/* eslint no-console: "off" */

const _     = require('lodash'),
      fetch = require('node-fetch'),
      lib   = require('../lib'),
      chalk = require('chalk');

class Command {

  constructor() {
    this.commandHelp = '*** command help ***';
    this.description = '*** command description ***';
  }

  builder() {
  }

  handler(argv) {
    this.argv = argv;
    lib.getConnectionParams(argv, this.handleConnectionParams.bind(this));
  }

  handleConnectionParams(connParams) {
    this.connParams = connParams;
    lib.showConnectionParams();
    this.handleCommand(this.argv, connParams);
  }

  doRequest({ url, method, data, onJsonReply }) {
    var fetchOptions = { method: method, headers: { 'Content-Type': 'application/json' } };

    if (data) {
      _.extend(fetchOptions, { body: JSON.stringify(data) });
    }

    if (this.connParams.sessionToken) {
      _.extend(fetchOptions.headers, {
        'X-XSRF-TOKEN': this.connParams.sessionToken,
        'Cookie': 'XSRF-TOKEN=' + this.connParams.sessionToken
      });
    }

    fetch(url, fetchOptions)
      .then((response) => this.handleResponse(response))
      .then((json) => this.handleJsonResponse(onJsonReply, json))
      .catch((err) => this.handleFetchError(err));
  }

  /*
   * Invokes onJsonReply with JSON data returned by the server.
   */
  getRequest(url, onJsonReply) {
    this.doRequest({url: url, method: 'GET', onJsonReply: onJsonReply});
  }

  /*
   * Invokes onJsonReply with JSON data returned by the server.
   */
  postRequest(url, data, onJsonReply) {
    var options = {url: url, method: 'POST', onJsonReply: onJsonReply};
    if (data) {
      options.data = data;
    }
    this.doRequest(options);
  }

  handleResponse(response) {
    if (response.status === 200) {
      return response.json();
    }
    console.log(chalk.red('response code:', response.status));
    console.log(chalk.red('url:', response.url));
    //console.log(response);
    return undefined;
  }

  handleJsonResponse(onJsonReply, json) {
    if (json) {
      onJsonReply(json);
    }
  }

  handleFetchError(err) {
    console.log(chalk.red('Command::getRequest: error:', err));
  }

}

module.exports = Command;
