/* eslint no-sync: "off" */
/* eslint no-console: "off" */
/* global process */

const Promise = require('bluebird'),
      prompt  =  Promise.promisifyAll(require('prompt')),
      fs      =  Promise.promisifyAll(require('fs'));

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

  /*
   * Call this to get config params.
   */
  getConfig(argv) {
    var config = () => {
      if (argv.n) {
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
    return fs.readFileAsync(configFile, 'utf8')
      .then(function (content) {
        return JSON.parse(content);
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
    return fs.writeFileAsync(configFile, JSON.stringify(config));
  }

  /*
   * Returns true if the configuration file is missing or if it does not contain an email setting.
   */
  isNewConfigRequired() {
    return (this.config.email === undefined);
  }

  promptForConfig() {
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
    return prompt.getAsync(this.promptSchema)
      .then((connParams) => {
        if (connParams.saveConfigToFile) {
          return this.writeConfig(connParams).then(() => connParams);
        }
        return Promise.resolve(connParams);
      })
      .catch(function (err) {
        console.log(err);
        return 1;
      });
  }

}

module.exports = Config;
