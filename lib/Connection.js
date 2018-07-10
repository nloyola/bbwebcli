/* eslint no-console: "off" */

const logger          = require('./logger');
const _               = require('lodash');
const Promise         = require('bluebird');
const fetch           = require('node-fetch');
const chalk           = require('chalk');
const ConnectionError = require('./errors/ConnectionError');
const LoginError      = require('./errors/LoginError');

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

    logger.debug(`fetch: ${completeUrl}: ${JSON.stringify(fetchOptions)}`);

    this.showConnectionParams();

    return fetch(completeUrl, fetchOptions)
      .then((response) => this.handleResponse(response));
  }

  /*
   * Invokes onJsonReply with JSON data returned by the server.
   */
  getRequest(url) {
    return this.doRequest({url: `api/${url}`, method: 'GET'});
  }

  /*
   * Invokes onJsonReply with JSON data returned by the server.
   */
  postRequest(url, data) {
    var options = { url: `api/${url}`, method: 'POST' };
    if (data) {
      options.data = data;
    }
    return this.doRequest(options);
  }

  deleteRequest(url) {
    return this.doRequest({url: `api/${url}`, method: 'DELETE'});
  }

  handleResponse(response) {
    const status = response.status;

    logger.debug('handleResponse: status', status);

    if (response.url.includes('/users/login')) {
      return this.handleLoginResponse(response);
    }

    return response.text()
      .then(text => {
        if (!text) {
          if (status < 400) {
            return Promise.resolve({});
          } else if (status === 401){
            return Promise.reject(new ConnectionError(status, 'unauthorized'));
          }
          return Promise.reject(new ConnectionError(status, 'response body is empty'));
        }

        const json = JSON.parse(text);
        logger.debug('handleResponse: json', json);

        if (status < 400) {
          return Promise.resolve(json);
        }
        return Promise.reject(new ConnectionError(status, JSON.stringify(json.message)));
      });
  }

  handleLoginResponse(response) {
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      const regex = /XSRF-TOKEN=([^;]+); Path=\//;
      const found = cookies.match(regex);

      if (found) {
        const token = found[1];
        return Promise.resolve(token);
      }
    }
    return Promise.reject(new LoginError('authentication failed'));
  }

}

module.exports = Connection;
