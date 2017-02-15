/* eslint no-console: "off" */

const _               = require('lodash'),
      Promise         = require('bluebird'),
      fetch           = require('node-fetch'),
      chalk           = require('chalk'),
      winston         = require('winston'),
      ConnectionError = require('./errors/ConnectionError'),
      LoginError      = require('./errors/LoginError');

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
        completeUrl = this.getUrl() + url;

    if (data) {
      _.extend(fetchOptions, { body: JSON.stringify(data) });
    }

    if (url.includes('/users/login')) {
      this.config.sessionToken = undefined;
    }

    if (this.config.sessionToken) {
      _.extend(fetchOptions.headers, {
        'X-XSRF-TOKEN': this.config.sessionToken,
        'Cookie': 'XSRF-TOKEN=' + this.config.sessionToken
      });
    }

    winston.debug('fetch:', completeUrl, fetchOptions.method);
    winston.debug('fetch headers:', fetchOptions.headers);

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

    if (response.url.includes('/users/login')) {
      return this.handleLoginResponse(response);
    }

    return response.text().then((text) => {
      if (!text) {
        if (status < 400) {
          return Promise.resolve({});
        }

        return Promise.reject(new ConnectionError(status, 'response body is empty'));
      }

      const json = JSON.parse(text);
      winston.log('debug', 'handleResponse: json', json);

      if (status === 200) {
        return Promise.resolve(json);
      }

      return Promise.reject(new ConnectionError(status, JSON.stringify(json.message)));
    });
  }

  handleLoginResponse(response) {
    if (response.headers._headers['set-cookie']) {
      const cookie = response.headers._headers['set-cookie'][0],
            regex = /XSRF-TOKEN=([^;]+); Path=\//,
            found = cookie.match(regex);

      if (found) {
        const token = found[1];
        return Promise.resolve(token);
      }
    }
    return Promise.reject(new LoginError('authentication failed'));
  }

}

module.exports = Connection;
