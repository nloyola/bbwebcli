#!/usr/bin/env node

/* eslint no-console: "off" */

const _             = require('lodash'),
      CeventCommand = require('../../../lib/CeventCommand');

const COMMAND = 'add <name> <cevent> <study>';

const DESCRIPTION = 'Adds a specimen to a collection event.';

const USAGE = `$0 cevent specimen ${COMMAND}

${DESCRIPTION}

NAME is the name to assign to the specimen. CEVENT is the name of the collection event to add this
specimen to. STUDY is the name of the study the collection event belongs to. CEVENT and STUDY must
already exist.`;

const ANATOMICAL_SOURCE_TYPES = {
    BLOOD:            'Blood',
    BRAIN:            'Brain',
    COLON:            'Colon',
    KIDNEY:           'Kidney',
    ASCENDING_COLON:  'Ascending_Colon',
    DESCENDING_COLON: 'Descending_Colon',
    TRANSVERSE_COLON: 'Transverse_Colon',
    DUODENUM:         'Duodenum',
    HAIR:             'Hair',
    ILEUM:            'Ileum',
    JEJENUM:          'Jejenum',
    STOMACH_ANTRUM:   'Stomach_Antrum',
    STOMACH_BODY:     'Stomach_Body',
    STOOL:            'Stool',
    TOE_NAILS:        'Toe_Nails',
    URINE:            'Urine'
};

const PRESERVATION_TYPE = {
    FROZEN_SPECIMEN: 'Frozen_Specimen',
    RNA_LATER:       'RNA_Later',
    FRESH_SPECIMEN:  'Fresh_Specimen',
    SLIDE:           'Slide'
};

const PRESERVATION_TEMPERATURE_TYPE = {
    PLUS_4_CELCIUS:    '4_C',
    MINUS_20_CELCIUS:  '-20_C',
    MINUS_80_CELCIUS:  '-80_C',
    MINUS_180_CELCIUS: '-180_C',
    ROOM_TEMPERATURE:  'Room_Temperature'
  };

const SPECIMEN_TYPE = {
      BUFFY_COAT:                   'Buffy_coat',
      CDPA_PLASMA:                  'CDPA_Plasma',
      CENTRIFUGED_URINE:            'Centrifuged_Urine',
      CORD_BLOOD_MONONUCLEAR_CELLS: 'Cord_Blood_Mononuclear_Cells',
      DNA_BLOOD:                    'DNA_(Blood)',
      DNA_WHITE_BLOOD_CELLS:        'DNA_(White_blood_cells)',
      DESCENDING_COLON:             'Descending_Colon',
      DUODENUM:                     'Duodenum',
      FILTERED_URINE:               'Filtered_Urine',
      FINGER_NAILS:                 'Finger_Nails',
      HAIR:                         'Hair',
      HEMODIALYSATE:                'Hemodialysate',
      HEPARIN_BLOOD:                'Heparin_Blood',
      ILEUM:                        'Ileum',
      JEJUNUM:                      'Jejunum',
      LITHIUM_HEPARIN_PLASMA:       'Lithium_Heparin_Plasma',
      MECONIUM_BABY:                'Meconium_-_BABY',
      PAXGENE:                      'Paxgene',
      PERITONEAL_DIALYSATE:         'Peritoneal_Dialysate',
      PLASMA_NA_HEPARIN_DAD:        'Plasma_(Na_Heparin)_-_DAD',
      PLASMA:                       'Plasma',
      PLATELET_FREE_PLASMA:         'Platelet_free_plasma',
      RNA:                          'RNA',
      RNA_CBMC:                     'RNA_CBMC',
      RNA_LATER_BIOPSIES:           'RNAlater_Biopsies',
      SERUM:                        'Serum',
      SODIUM_AZIDE_URINE:           'SodiumAzideUrine',
      SOURCE_WATER:                 'Source_Water',
      TAP_WATER:                    'Tap_Water',
      TRANSVERSE_COLON:             'Transverse_Colon'
};

class CeventSpecimenAddCommand extends CeventCommand {

  constructor() {
    super(USAGE);
  }

  handleCommand() {
    this.studyName = this.argv.study;
    return super.handleCommand();
  }

  builder(yargs) {
    return super.builder(yargs)
      .string('d')
      .nargs('d', 1)
      .alias('d', 'description')
      .describe('d', 'the description for this specimen')

      .alias('u', 'units')
      .describe('u', 'The units used to measure the specimen')

      .alias('a', 'anatomical-source')
      .describe('a', 'The method used to preserve the specimen')
      .choices('a', _.values(ANATOMICAL_SOURCE_TYPES))

      .alias('p', 'preservation-type')
      .describe('p', 'The method used to preserve the specimen')
      .choices('p', _.values(PRESERVATION_TYPE))

      .alias('t', 'preservation-temperature')
      .describe('t', 'The temperature that must be used to preserve the specimen')
      .choices('t', _.values(PRESERVATION_TEMPERATURE_TYPE))

      .alias('s', 'specimen-type')
      .describe('s', 'The type of the specimen')
      .choices('s', _.values(SPECIMEN_TYPE))

      .alias('c', 'count')
      .number('c')
      .nargs('c', 1)
      .describe('c', 'The number of specimens to collect')

      .number('amount')
      .nargs('amount', 1)
      .describe('amount', 'The amount to collect per specimen')

      .demandOption([
        'units',
        'anatomical-source',
        'preservation-type',
        'preservation-temperature',
        'specimen-type'
      ]);
  }

  handleCeventReply(cevent) {
    const reqJson = {
      studyId:                     this.study.id,
      expectedVersion:             cevent.version,
      name:                        this.argv.name,
      units:                       this.argv.units,
      anatomicalSourceType:        this.argv.anatomicalSource.replace('_', ' '),
      preservationType:            this.argv.preservationType.replace('_', ' '),
      preservationTemperatureType: this.argv.preservationTemperature.replace('_', ' '),
      specimenType:                this.argv.specimenType.replace('_', ' '),
      maxCount:                    this.argv.count,
      amount:                      this.argv.amount
    };

    if (this.argv.description) {
      reqJson.description = this.argv.description;
    }

    return this.connection.postRequest('studies/cetypes/spcspec/' + cevent.id, reqJson)
      .then((json) => this.handleJsonReply(json));
  }

  handleJsonReply() {
    console.log('specimen added to collection event:', this.argv.name);
  }

}

var command = new CeventSpecimenAddCommand();

exports.command  = COMMAND;
exports.describe = DESCRIPTION;
exports.builder  = (yargs) => command.builder(yargs);
exports.handler  = (argv) => command.handler(argv);

/* Local Variables: */
/* mode: js2        */
/* End:             */
