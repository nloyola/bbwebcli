/* eslint no-console: "off" */

const _     = require('lodash'),
      fetch = require('node-fetch'),
      chalk = require('chalk');

class Connection {

  constructor(argv, config) {
    this.argv = argv;
    this.config = config;
  }

  showConnectionParams() {
    if (!this.config) {
      throw new Error('configuration not loaded yet!');
    }

    console.log('host URL:', chalk.green(this.getUrl()));
    console.log('email:', chalk.blue(this.config.email));
  }

  getUrl() {
    var port = this.config.port,
        portStr = port.toString(),
        scheme = portStr.includes('443') ? 'https': 'http';
    return scheme + '://' + this.config.hostname + ':' + port + '/';
  }

  doRequest({ url, method, data, onJsonReply }) {
    var fetchOptions = { method: method, headers: { 'Content-Type': 'application/json' } },
        completeUrl = this.getUrl() + url,
        sessionToken;

    if (data) {
      _.extend(fetchOptions, { body: JSON.stringify(data) });
    }

    sessionToken = this.config.sessionToken;
    if (sessionToken) {
      _.extend(fetchOptions.headers, {
        'X-XSRF-TOKEN': sessionToken,
        'Cookie': 'XSRF-TOKEN=' + sessionToken
      });
    }

    fetch(completeUrl, fetchOptions)
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

module.exports = Connection;
