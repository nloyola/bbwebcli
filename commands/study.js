#!/usr/bin/env node

exports.command = 'study <command>';
exports.describe = 'Commands related to studies.';
exports.builder = (yargs) => yargs.commandDir('study');
exports.handler = () => {};

/* Local Variables:  */
/* mode: js2         */
/* End:              */
