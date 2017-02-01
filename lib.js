// -*-:mode: js2-mode; -*-

/* eslint no-sync: "off" */
/* eslint no-console: "off" */
/* global process */

const prompt = require('prompt'),
      fs     = require('fs'),
      chalk  = require('chalk');

const configFilename = './config.json';

// see https://gist.github.com/dperini/729294 for URL regular expression
var promptSchema = {
  properties: {
    hostname: {
      pattern: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/,
      message: 'Invalid host name',
      required: true
    },
    port: {
      type: 'number',
      message: 'Invalid port number',
      required: true
    },
    email: {
      pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Invalid email address',
      required: true
    },
    saveConfigToFile: {
      type: 'boolean',
      default: true
    }
  }
};

var config;

function readConfig() {
  var rawConfig = fs.readFileSync(configFilename);
  try {
    config = JSON.parse(rawConfig);
  } catch (err) {
    config = {
      hostname: 'localhost',
      port: 9000
    };
  }
  return config;
}

function writeConfig({ hostname, port, email, sessionToken = undefined}) {
  var config = {
    hostname: hostname,
    port:     port
  };
  if (email) {
    config.email = email;
  }
  if (sessionToken) {
    config.sessionToken = sessionToken;
  }
  fs.writeFile(configFilename, JSON.stringify(config), function (err) {
    if (err) {
      throw new Error('could not save configuration to file "' + configFilename + '"');
    }
  });
}

function onPromptErr(err) {
  console.log(err);
  return 1;
}

/*
 * Returns true if the configuration file is missing or if it does not contain an email setting.
 */
function areConnectionParamsRequired() {
  return (config.email === undefined);
}

function promptConnectionParams(argv, onResultFn) {
  if (config.hostname) {
    promptSchema.properties.hostname.default = config.hostname;
  }

  if (config.port) {
    promptSchema.properties.port.default = config.port;
  }

  if (config.email) {
    promptSchema.properties.email.default = config.email;
  }

  prompt.start();
  prompt.get(promptSchema, (err, connParams) => {
    if (err) { return onPromptErr(err); }
    if (connParams.saveConfigToFile) {
      writeConfig(connParams);
    }
    return onResultFn(connParams);
  });
}

exports.getConnectionParams = function (argv, onResultFn) {
  config = readConfig();

  if (areConnectionParamsRequired()) {
    promptConnectionParams(argv, onResultFn);
  } else {
    onResultFn(config);
  }
};

exports.showConnectionParams = function () {
  if (!config) {
    throw new Error('configuration not loaded yet!');
  }

  console.log('host URL:', chalk.green(getUrl(config)));
  console.log('email:', chalk.blue(config.email));
};

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

exports.writeSessionToken = function (token) {
  var config = readConfig();
  config.sessionToken = token;
  writeConfig(config);
};

exports.getUrl = getUrl;

function getUrl(connParams) {
  var portStr = connParams.port.toString(),
      scheme = portStr.includes('443') ? 'https': 'http';
  return scheme + '://' + connParams.hostname + ':' + connParams.port + '/';
}
