/* eslint no-sync: "off" */
/* eslint no-console: "off" */
/* global process */

const prompt = require('prompt'),
      fs     = require('fs'),
      moment = require('moment'),
      chalk  = require('chalk');

const configFilename = './config.json';

var config;

exports.getPassword = function (onResultFn) {
    const schema = {
    properties: {
      password: {
        hidden: true
      }
    }
  };

  prompt.get(schema, (err, result) => {
    if (err) { return onPromptErr(err); }
    return onResultFn(result.password);
  });

};

exports.showConnectionParams = function () {
    if (!this.config) {
      throw new Error('configuration not loaded yet!');
    }

    console.log('host URL:', chalk.green(getUrl(config)));
    console.log('email:', chalk.blue(config.email));
  };

exports.getUrl = getUrl;

function getUrl(connParams) {
  var portStr = connParams.port.toString(),
      scheme = portStr.includes('443') ? 'https': 'http';
  return scheme + '://' + connParams.hostname + ':' + connParams.port + '/';
}

exports.dateToDisplayString = function (date) {
   return moment(date).local().format('YYYY-MM-DD');
};

/* Local Variables:  */
/* mode: js2-mode    */
/* End:              */
