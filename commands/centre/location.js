#!/usr/bin/env node

/* eslint no-console: "off" */

const CentreCommand = require('../../lib/CentreCommand'),
      CommandError  = require('../../lib/errors/CommandError');

const COMMAND = 'location <centre>';

const DESCRIPTION = 'Adds a location to a centre.';

const USAGE = `$0 centre ${COMMAND}

${DESCRIPTION}

CENTRE is the name of the centre.`;

class CentreLocationCommand extends CentreCommand {

  constructor() {
    super(USAGE);
  }

  builder(yargs) {
    return super.builder(yargs)

      .string('n')
      .alias('n', 'name')
      .nargs('n', 1)
      .describe('n', 'The location\'s name')

      .string('s')
      .alias('s', 'street')
      .nargs('s', 1)
      .describe('s', 'The street address')

      .string('c')
      .alias('c', 'city')
      .nargs('c', 1)
      .describe('c', 'The name of the city')

      .string('p')
      .alias('p', 'province')
      .nargs('p', 1)
      .describe('p', 'The name of the province')

      .string('postalcode')
      .nargs('postalcode', 1)
      .describe('postalcode', 'The postal code')

      .string('po-box')
      .nargs('po-box', 1)
      .describe('po-box', 'The post office box number')

      .string('country-iso')
      .nargs('country-iso', 1)
      .describe('country-iso', 'The country ISO code')
      .demandOption([
        'name',
        'street',
        'city',
        'province',
        'postalcode',
        'country-iso'
      ])

      .usage(USAGE);
  }

  handleCommand() {
    this.centreName = this.argv.centre;
    return super.handleCommand();
  }

  handleCentreCommand() {
    const json = {
      expectedVersion: this.centre.version,
      name:            this.argv.name,
      street:          this.argv.street,
      city:            this.argv.city,
      province:        this.argv.province,
      postalCode:      this.argv.postalcode,
      poBoxNumber:     this.argv.poBox,
      countryIsoCode:  this.argv.countryIso
    };

    return this.connection.postRequest('centres/locations/' + this.centre.id, json)
      .then((json) => this.handleJsonReply(json))
      .catch((json) => console.log('Error:', json.message));
  }

  handleJsonReply() {
    console.log('Location ' + this.argv.name + ' added to centre ' + this.argv.centre);
  }

}

var command = new CentreLocationCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables:  */
/* mode: js2    */
/* End:              */
