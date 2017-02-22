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
  ASCENDING_COLON:  'Ascending Colon',
  DESCENDING_COLON: 'Descending Colon',
  TRANSVERSE_COLON: 'Transverse Colon',
  DUODENUM:         'Duodenum',
  HAIR:             'Hair',
  ILEUM:            'Ileum',
  JEJENUM:          'Jejenum',
  STOMACH_ANTRUM:   'Stomach Antrum',
  STOMACH_BODY:     'Stomach Body',
  STOOL:            'Stool',
  TOE_NAILS:        'Toe Nails',
  URINE:            'Urine'
};

const PRESERVATION_TYPE = {
  FROZEN_SPECIMEN: 'Frozen Specimen',
  RNA_LATER:       'RNA Later',
  FRESH_SPECIMEN:  'Fresh Specimen',
  SLIDE:           'Slide'
};

const PRESERVATION_TEMPERATURE_TYPE = {
  PLUS_4_CELCIUS:    '4 C',
  MINUS_20_CELCIUS:  '-20 C',
  MINUS_80_CELCIUS:  '-80 C',
  MINUS_180_CELCIUS: '-180 C',
  ROOM_TEMPERATURE:  'Room Temperature'
};

const SPECIMEN_TYPE = {
  BUFFY_COAT:                   'Buffy coat',
  CDPA_PLASMA:                  'CDPA Plasma',
  CENTRIFUGED_URINE:            'Centrifuged Urine',
  CORD_BLOOD_MONONUCLEAR_CELLS: 'Cord Blood Mononuclear Cells',
  DNA_BLOOD:                    'DNA (Blood)',
  DNA_WHITE_BLOOD_CELLS:        'DNA (White blood cells)',
  DESCENDING_COLON:             'Descending Colon',
  DUODENUM:                     'Duodenum',
  FILTERED_URINE:               'Filtered Urine',
  FINGER_NAILS:                 'Finger Nails',
  HAIR:                         'Hair',
  HEMODIALYSATE:                'Hemodialysate',
  HEPARIN_BLOOD:                'Heparin Blood',
  ILEUM:                        'Ileum',
  JEJUNUM:                      'Jejunum',
  LITHIUM_HEPARIN_PLASMA:       'Lithium Heparin Plasma',
  MECONIUM_BABY:                'Meconium - BABY',
  NAN3_URINE:                   'NaN3 Urine',
  PAXGENE:                      'Paxgene' ,
  PERITONEAL_DIALYSATE:         'Peritoneal Dialysate',
  PLASMA_NA_HEPARIN_DAD:        'Plasma (Na Heparin) - DAD',
  PLASMA:                       'Plasma',
  PLATELET_FREE_PLASMA:         'Platelet free plasma',
  RNA:                          'RNA',
  RNA_CBMC:                     'RNA CBMC',
  RNA_LATER_BIOPSIES:           'RNAlater Biopsies',
  SERUM:                        'Serum',
  SODIUM_AZIDE_URINE:           'SodiumAzideUrine',
  SOURCE_WATER:                 'Source Water',
  STOOL:                        'Stool',
  TAP_WATER:                    'Tap Water',
  TRANSVERSE_COLON:             'Transverse Colon',
  URINE:                        'Urine',
  WHOLE_BLOOD:                  'Whole Blood',
  WHOLE_BLOOD_CPDA:             'Whole Blood CPDA',
  WHOLE_BLOOD_EDTA:             'Whole Blood EDTA',
  WHOLE_BLOOD_LI_HEP:           'Whole Blood Li Hep'
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
      anatomicalSourceType:        this.argv.anatomicalSource,
      preservationType:            this.argv.preservationType,
      preservationTemperatureType: this.argv.preservationTemperature,
      specimenType:                this.argv.specimenType,
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
