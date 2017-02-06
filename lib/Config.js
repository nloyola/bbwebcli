/* eslint no-sync: "off" */
/* eslint no-console: "off" */
/* global process */

const prompt = require('prompt'),
      fs     = require('fs');

const configFile = 'config.json';

class Config {

  constructor(argv) {
    this.argv = argv;
    this.config = {};

    // see https://gist.github.com/dperini/729294 for URL regular expression
    this.promptSchema = {
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

  }

  /*
   * Call this to get config params.
   */
  getConfig (argv, onResultFn) {
    if (argv.n) {
      this.config = {
        hostname: 'localhost',
        port: 9000
      };
    } else {
      this.config = this.readConfig();
    }

    if (this.isNewConfigRequired()) {
      this.promptForConfig(argv, onResultFn);
    } else {
      onResultFn(this.config);
    }
  }

  /*
   * Should only be used by the login command.
   */
  writeSessionToken(token) {
    var config = this.readConfig();
    config.sessionToken = token;
    this.writeConfig(config);
  }

  getSessionToken() {
    return this.config.sessionToken;
  }

  readConfig() {
    var rawConfig, config;

    try {
      rawConfig = fs.readFileSync(configFile);
      config = JSON.parse(rawConfig);
    } catch (err) {
      config = {
        hostname: 'localhost',
        port: 9000
      };
    }
    return config;
  }

  writeConfig({ hostname, port, email, sessionToken = undefined}) {
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
    fs.writeFile(configFile, JSON.stringify(config), function (err) {
      if (err) {
        throw new Error('could not save configuration to file "' + configFile + '"');
      }
    });
  }

  /*
   * Returns true if the configuration file is missing or if it does not contain an email setting.
   */
  isNewConfigRequired() {
    return (this.config.email === undefined);
  }

  promptForConfig(argv, onResultFn) {
    if (this.config.hostname) {
      this.promptSchema.properties.hostname.default = this.config.hostname;
    }

    if (this.config.port) {
      this.promptSchema.properties.port.default = this.config.port;
    }

    if (this.config.email) {
      this.promptSchema.properties.email.default = this.config.email;
    }

    prompt.start();
    prompt.get(this.promptSchema, (err, connParams) => {
      if (err) { return this.onPromptErr(err); }
      if (connParams.saveConfigToFile) {
        this.writeConfig(connParams);
      }
      return onResultFn(connParams);
    });
  }

  onPromptErr(err) {
    console.log(err);
    return 1;
  }

}

module.exports = Config;
