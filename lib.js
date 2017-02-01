// -*-:mode: js2-mode; -*-

/* eslint no-sync: "off" */
/* eslint no-console: "off" */
/* global process */

const prompt = require('prompt'),
      fs     = require('fs');

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
    password: {
      hidden: true
    },
    saveConfigToFile: {
      type: 'boolean',
      default: true
    }
  }
};

function readConfig() {
  const config = fs.readFileSync(configFilename);
  try {
    return JSON.parse(config);
  } catch (err) {
    return {
      hostname: 'localhost',
      port: 9000
    };
  }
}

function writeConfig({ hostname, port, email}) {
  var config = {
    hostname: hostname,
    port:     port
  };
  if (email) {
    config.email = email;
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

exports.getConnectionParams = function (onResultFn) {
  var config = readConfig();

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
  prompt.get(promptSchema, function (err, connParams) {
    if (err) { return onPromptErr(err); }
    if (connParams.saveConfigToFile) {
      writeConfig(connParams);
    }
    return onResultFn(connParams);
  });
};
