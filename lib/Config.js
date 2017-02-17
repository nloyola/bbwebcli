/* eslint no-sync: "off" */
/* eslint no-console: "off" */
/* global process */

const Promise = require('bluebird'),
      prompt  = Promise.promisifyAll(require('prompt')),
      fs      = Promise.promisifyAll(require('fs'));

const CONFIG_FILE = 'config.json';

// see https://gist.github.com/dperini/729294 for URL regular expression
const PROMPT_SCHEMA = {
  properties: {
    hostname: {
      pattern: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/,
      description: 'Enter the Biobank server\'s domain name:',
      message: 'Invalid host name',
      required: true
    },
      port: {
        type: 'number',
        description: 'Enter the port number used by the Biobank server:',
        message: 'Invalid host name',
        required: true
      },
      email: {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        description: 'Enter the email address used to log into the Biobank server:',
        message: 'Invalid email address',
        required: true
      },
      saveConfigToFile: {
        type: 'string',
        pattern: /(Y|y|N|n)/,
        description: 'Save these settings for future commands?',
        default: 'Y'
      }
  }
};

class Config {

  constructor(argv) {
    this.argv = argv;
    this.config = {};
  }

  get hostname() {
    return this.config.hostname;
  }

  get port() {
    return this.config.port;
  }

  get email() {
    return this.config.email;
  }

  get sessionToken() {
    return this.config.sessionToken;
  }

  set sessionToken(value) {
    this.config.sessionToken = value;
  }

  /*
   * Call this to get config params.
   */
  getConfig() {
    var config = () => {
      if (this.argv.newConnection) {
        return Promise.resolve({
          hostname: 'localhost',
          port: 9000
        });
      } else {
        return this.readConfig();
      }
    };

    return config().then((config) => {
      this.config = config;
      if (this.isNewConfigRequired()) {
        return this.promptForConfig();
      }
      return Promise.resolve(this.config);
    });
  }

  /*
   * Should only be used by the login command.
   */
  writeSessionToken(token) {
    return this.readConfig().then((config) => {
      config.sessionToken = token;
      return this.writeConfig(config);
    });
  }

  readConfig() {
    return fs.readFileAsync(CONFIG_FILE, 'utf8')
      .then(function (content) {
        return Promise.resolve(JSON.parse(content));
      })
      .catch(function () {
        return Promise.resolve({
          hostname: 'localhost',
          port: 9000
        });
      });
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
    return fs.writeFileAsync(CONFIG_FILE, JSON.stringify(config));
  }

  /*
   * Returns true if the configuration file is missing or if it does not contain an email setting.
   */
  isNewConfigRequired() {
    return (this.config.email === undefined);
  }

  promptForConfig() {
    if (this.config.hostname) {
      PROMPT_SCHEMA.properties.hostname.default = this.config.hostname;
    }

    if (this.config.port) {
      PROMPT_SCHEMA.properties.port.default = this.config.port;
    }

    if (this.config.email) {
      PROMPT_SCHEMA.properties.email.default = this.config.email;
    }

    prompt.start();
    return prompt.getAsync(PROMPT_SCHEMA)
      .then((connParams) => {
        if (connParams.saveConfigToFile.toLowerCase() === 'y') {
          return this.writeConfig(connParams).then(() => {
            this.config = connParams;
            return connParams;
          });
        }
        return Promise.resolve(connParams);
      })
      .catch(function (err) {
        console.log(err);
        return new Error(err);
      });
  }

}

module.exports = Config;
