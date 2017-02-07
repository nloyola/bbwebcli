/* eslint no-console: "off" */

const _          = require('lodash'),
      Bluebird   = require('bluebird'),
      fetch      = require('node-fetch'),
      FetchError = require('fetch-error'),
      chalk      = require('chalk');

fetch.Promise = Bluebird;

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

    //console.log('fetch url:', completeUrl);
    //console.log('fetch options:', fetchOptions);

    return fetch(completeUrl, fetchOptions)
      .then((response) => this.handleResponse(response))
      .catch((err) => Promise.reject(err.message));
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

  handleResponse(response) {
    if (response.status === 200) {
      return response.json();
    }

    if (response.status === 401) {
      console.log(chalk.red('Unauthorized'));
      console.log(chalk.red('Please login'));
      return Promise.reject(response);
    }

    console.log(chalk.red('response code:', response.status));
    console.log(chalk.red('url:', response.url));
    return Promise.reject(response);
  }

}

module.exports = Connection;
