#!/usr/bin/env node

/* eslint no-console: "off" */

const _            = require("lodash"),
      StudyCommand = require('./StudyCommand'),
      CommandError = require('./errors/CommandError');

const VALUE_TYPES = {
  TEXT:            'text',
  NUMBER:          'number',
  DATE_TIME:       'datetime',
  SINGLE_SELECT:   'single-select',
  MULTIPLE_SELECT: 'multiple-select'
};

class StudyAnnotAddCommand extends StudyCommand {

  builder(yargs) {
    return super.builder(yargs)
      .alias('v', 'value-type')
      .nargs('v', 1)
      .choices('v', _.values(VALUE_TYPES))
      .describe('v', 'The value type for this annotation')
      .array('o')
      .alias('o', 'select-options')
      .describe('o', 'The options available for the single or multiple select')
      .boolean('r')
      .alias('r', 'required')
      .describe('r', 'If the annotation is required')
      .demandOption([ 'value-type' ]);
  }

  handleCommand() {
    this.studyName = this.argv.study;
    return super.handleCommand();
  }

  // returns the common fields for an annotation
  createStudyAnnotation() {
    var reqJson = {
      name:     this.argv.name,
      required: this.argv.required || false
    };

    if ((this.argv.valueType === VALUE_TYPES.SINGLE_SELECT) ||
        (this.argv.valueType === VALUE_TYPES.MULTIPLE_SELECT)) {
      if (!this.argv.o) {
        return Promise.reject(new CommandError('StudyAnnotAddCommand', 'no options specified'));
      }

      reqJson.valueType = 'select';
      reqJson.maxValueCount = (this.argv.valueType === VALUE_TYPES.MULTIPLE_SELECT) ? 2 : 1;
      reqJson.options = this.argv.o;
    } else {
      reqJson.valueType = this.argv.valueType;
      reqJson.options = [];
    }

    if (this.argv.description) {
      reqJson.description = this.argv.description;
    }

    return reqJson;
  }

  handleJsonReply() {
    return Promise.reject(new CommandError('StudyAnnotAddCommand',
                                           'derived class should override this method'));
  }

}

module.exports = StudyAnnotAddCommand;

/* Local Variables: */
/* mode: js2        */
/* End:             */
