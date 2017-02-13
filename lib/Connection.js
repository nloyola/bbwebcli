/* eslint no-console: "off" */

const _          = require('lodash'),
      Promise    = require('bluebird'),
      fetch      = require('node-fetch'),
      chalk      = require('chalk'),
      winston    = require('winston'),
      ConnectionError = require('./errors/ConnectionError');

fetch.Promise = Promise;

Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
});

Promise.onPossiblyUnhandledRejection(function(e) {
  throw e;
});

class Connection {

  constructor(argv, config) {
    this.argv = argv;
    this.config = config;
    this.connectionParamsShown = false;
  }

  showConnectionParams() {
    if (!this.config) {
      throw new Error('configuration not loaded yet!');
    }

    if (!this.connectionParamsShown) {
      console.log('host URL:', chalk.green(this.getUrl()));
      console.log('email:', chalk.blue(this.config.email));
      this.connectionParamsShown = true;
    }
  }

  getUrl() {
    var port = this.config.port,
        portStr = port.toString(),
        scheme = portStr.includes('443') ? 'https': 'http';
    return scheme + '://' + this.config.hostname + ':' + port + '/';
  }

  doRequest({ url, method, data }) {
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

    winston.log('debug', 'fetch url:', completeUrl);
    winston.log('debug', 'fetch options:', fetchOptions);

    this.showConnectionParams();

    return fetch(completeUrl, fetchOptions)
      .then((response) => this.handleResponse(response));
  }

  /*
   * Invokes onJsonReply with JSON data returned by the server.
   */
  getRequest(url) {
    return this.doRequest({url: url, method: 'GET'});
  }

  /*
   * Invokes onJsonReply with JSON data returned by the server.
   */
  postRequest(url, data, onJsonReply) {
    var options = {url: url, method: 'POST', onJsonReply: onJsonReply};
    if (data) {
      options.data = data;
    }
    return this.doRequest(options);
  }

  deleteRequest(url) {
    return this.doRequest({url: url, method: 'DELETE'});
  }

  handleResponse(response) {
    const status = response.status;

    winston.log('debug', 'handleResponse: status', status);

    return response.json().then((json) => {
      if (status === 200) {
        return Promise.resolve(json);
      }

      if (status === 401) {
        return Promise.reject(new ConnectionError(status, json.message));
      }

      return Promise.reject(new ConnectionError(status, response.url));
    });
  }

}

module.exports = Connection;
